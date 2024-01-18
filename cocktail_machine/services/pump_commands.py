import logging
import threading
import time

import requests
from flask_sock import Sock

from cocktail_machine import database
from cocktail_machine.exceptions.cocktail_machine_exception import PumpInUseException, BadRequestException
from cocktail_machine.services import pump_service, machine_service
from cocktail_machine.services.singleton import Singleton

sem = threading.Semaphore()
sock = Sock()


@sock.route('/echo')
def echo(ws):
    state = ''
    machines = machine_service.get()
    pc = PumpCommands.instance()
    while len(machines) > 0:
        new_state = pc.check_status(machines)
        if state != new_state:
            state = _notify(ws, new_state)
        time.sleep(0.5)


def _notify(ws, state):
    logging.info(f'state: {state}')
    ws.send(state)
    return state


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


def _add_history(mr):
    timestamp = round(time.time())
    conn = database.get_connection()
    cur = conn.cursor()
    names = [p.pump['name'] for p in mr.pump_requests]
    seconds = [str(p.seconds) for p in mr.pump_requests]
    flow_rates_in_ml_per_sec = [str(p.pump['flowRateInMlPerSec']) for p in mr.pump_requests]
    ports = [str(p.pump['port']) for p in mr.pump_requests]

    cur.execute("""INSERT INTO history (timestamp, name, port, seconds, flowRateInMlPerSec, machineName, domain) 
                VALUES(%s, %s, %s, %s, %s, %s, %s) RETURNING id;""",
                (timestamp, "-".join(names), "-".join(ports), "-".join(seconds), "-".join(flow_rates_in_ml_per_sec),
                 mr.machine['name'], mr.machine['domain']))
    conn.commit()
    conn.close()


@Singleton
class PumpCommands:

    def __init__(self):
        self.state = {"time": time.time(), "status": ""}

    def check_status(self, machines):
        state = self.state["status"]
        if state != 'locked' and _is_locked():
            state = 'locked'
        elif time.time() < self.state["time"] + 1.5:
            return state
        elif not _is_locked():
            try:
                r = requests.post(f'{machines[0]["domain"]}/api/health', timeout=1)
                if r.status_code != 200 and state != 'offline':
                    state = 'offline'
                elif r.status_code == 200 and state != 'online':
                    state = 'online'
            except:
                if state != 'offline':
                    state = 'offline'
        self.state = {"time": time.time(), "status": state}
        return state

    def execute_pump(self, pump, **kwargs):
        seconds = kwargs.pop("seconds", None)
        ml = kwargs.pop("ml", None)

        if _is_locked():
            raise PumpInUseException()

        sem.acquire()
        pump_request = PumpRequest(pump, seconds=seconds, ml=ml)
        machine_request = MachineRequest([pump_request])
        _add_history(machine_request)
        _run_request(machine_request)
        sem.release()

    def execute_recipe(self, recipe, disabled_ingredients):
        if _is_locked():
            raise PumpInUseException()

        sem.acquire()

        try:
            pumps = pump_service.get()
            ingredients = {}
            [ingredients.update({p['name'].lower(): p}) for p in pumps]
            keys = {}
            [keys.update({i: ingredients[recipe[f'strIngredient{i}'].lower()]}) for i in range(1, 15)
             if i not in disabled_ingredients and recipe[f'strIngredient{i}'] is not None and recipe[
                 f'strIngredient{i}'].lower() in ingredients]

            if len(keys.items()) == 0:
                raise BadRequestException('No ingredients to prepare the drink', 1002)

            pump_requests = []
            for i, pump in keys.items():
                if recipe[f'strMeasure{i}'] is None or recipe[f'strMeasure{i}'] == "":
                    raise BadRequestException('Measure is not present', 1004)

                exp = recipe[f'strMeasure{i}'].strip().lower()
                if 'oz' in exp:
                    exp = exp.replace('oz', '').strip().replace(' ', '+')
                    result = eval(exp) * 29.5735
                elif 'shot' in exp:
                    exp = exp.replace('shot', '').replace('shots', '').strip().replace(' ', '+')
                    result = eval(exp) * 45
                elif 'part' in exp:
                    exp = exp.replace('part', '').replace('parts', '').strip().replace(' ', '+')
                    result = eval(exp) * 45
                elif 'cl' in exp:
                    exp = exp.replace('cl', '').strip().replace(' ', '+')
                    result = eval(exp) * 10
                elif 'ml' in exp:
                    result = float(exp)
                elif 'cup' in exp or 'top up with' in exp or 'fill to top' in exp:
                    exp = exp.replace('top up with', '').replace('fill to top', '').strip().replace(' ', '+')
                    if exp == '':
                        exp = '1'
                    result = float(exp) * 100
                else:
                    raise BadRequestException('Fail! Check code! Unit not known', 1003)

                pump_requests.append(PumpRequest(pump, ml=result))

            machine_request = MachineRequest(pump_requests)
            _add_history(machine_request)
            _run_request(machine_request)

            sem.release()
        except BaseException as e:
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
    def __init__(self, pump_requests):
        self.machine = self._get_machine(pump_requests)

        ports = "-".join([str(p.pump['port']) for p in pump_requests])
        seconds = "-".join([str(p.seconds) for p in pump_requests])
        self.url = f"{self.machine['domain']}/api/pump/{ports}/seconds/{seconds}"
        self.timeout = max([p.seconds for p in pump_requests]) + 2
        self.pump_requests = pump_requests

    def _get_machine(self, pump_request):
        machines = set([p.pump['machine']['id'] for p in pump_request])
        if len(machines) > 1:
            raise BadRequestException("This recipe has more than 1 machine", 1000)
        if len(machines) == 0:
            raise BadRequestException("No ingredients to prepare the recipe", 1001)
        return pump_request[0].pump['machine']
