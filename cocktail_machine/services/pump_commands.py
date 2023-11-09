import logging
import threading

import requests

from cocktail_machine.exceptions.cocktail_machine_exception import PumpInUseException, BadRequestException
from cocktail_machine.services import pump_service
from cocktail_machine.services.singleton import Singleton

sem = threading.Semaphore()


def _is_locked():
    return sem._value == 0


def _run_request(cocktail_machine_request):
    logging.info(f'request: calling {cocktail_machine_request.url}')
    try:
        response = requests.post(cocktail_machine_request.url, timeout=cocktail_machine_request.timeout)
        log = f'response: call to {cocktail_machine_request.url} returned {response.status_code}, {response.text}'
        if response.status_code == 204:
            logging.debug(log)
        else:
            logging.error(log)
            raise Exception(log)
    except Exception as e:
        sem.release()
        raise e


@Singleton
class PumpCommands:

    def execute_pump(self, pump, **kwargs):
        seconds = kwargs.pop("seconds", None)
        ml = kwargs.pop("ml", None)

        if _is_locked():
            raise PumpInUseException()

        sem.acquire()
        pump_request = PumpRequest(pump, seconds=seconds, ml=ml)
        _run_request(MachineRequest([pump_request]))
        sem.release()

    def execute_recipe(self, recipe):
        if _is_locked():
            raise PumpInUseException()

        sem.acquire()

        try:
            pumps = pump_service.get()
            ingredients = {}
            [ingredients.update({p['name'].lower(): p}) for p in pumps]
            keys = {}
            [keys.update({i: ingredients[recipe[f'strIngredient{i}'].lower()]}) for i in range(1, 15)
             if recipe[f'strIngredient{i}'] is not None and recipe[f'strIngredient{i}'].lower() in ingredients]

            pump_requests = []
            for i, pump in keys.items():
                exp = recipe[f'strMeasure{i}'].strip().replace(' oz', '').replace(' ', '+')
                result = eval(exp) * 29.5735
                pump_requests.append(PumpRequest(pump, ml=result))

            _run_request(MachineRequest(pump_requests))

            sem.release()
        except Exception as e:
            sem.release()
            raise e


class PumpRequest:
    def __init__(self, pump, seconds=None, ml=None):
        if seconds is not None:
            self.seconds = seconds
        else:
            self.seconds = ml / pump['flowRateInMlPerSec']
        self.pump = pump


class MachineRequest:
    def __init__(self, pump_request):
        machine = self._get_machine(pump_request)

        ports = "-".join([str(p.pump['port']) for p in pump_request])
        seconds = "-".join([str(p.seconds) for p in pump_request])
        self.url = f"{machine['domain']}/api/pump/{ports}/seconds/{seconds}"
        self.timeout = max([p.seconds for p in pump_request]) + 2

    def _get_machine(self, pump_request):
        machines = set([p.pump['machine']['id'] for p in pump_request])
        if len(machines) > 1:
            raise BadRequestException("This recipe has more than 1 machine", 1000)
        if len(machines) == 0:
            raise BadRequestException("No ingredients to prepare the recipe", 1001)
        return pump_request[0].pump['machine']
