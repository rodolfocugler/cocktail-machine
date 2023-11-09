import json
import logging

import flask
import requests
from flask_restx import Namespace, Resource

from cocktail_machine import config
from cocktail_machine.exceptions.cocktail_machine_exception import PumpInUseException, BadRequestException
from cocktail_machine.services import pump_service
from cocktail_machine.services.pump_commands import PumpCommands

api = Namespace('commands')

conf = config.Config()

pump_commands = PumpCommands.instance()


def execute_pump(pump, **kwargs):
    try:
        pump_commands.execute_pump(pump, **kwargs)
    except requests.exceptions.RequestException as e:
        logging.error(e)
        flask.abort(400, "Error while calling the machine")
    except PumpInUseException as e:
        logging.error(e)
        flask.abort(400, "Pump in use")
    except BadRequestException as e:
        logging.error(e)
        flask.abort(400, "Bad request exception")
    except Exception as e:
        logging.error(e)
        flask.abort(400, f"Error {e}")


@api.route('/commands/name/<string:name>/seconds/<int:seconds>')
@api.route('/commands/name/<string:name>/ml/<int:ml>')
class NameCommands(Resource):
    def post(self, name, ml=None, seconds=None):
        logging.debug(f'command  name={name}, ml={ml}, seconds={seconds}')
        pump = pump_service.get_by_name(name)
        execute_pump(pump=pump, ml=ml, seconds=seconds)


@api.route('/commands/id/<int:_id>/seconds/<int:seconds>')
@api.route('/commands/id/<int:_id>/ml/<int:ml>')
class PumpIdCommands(Resource):
    def post(self, _id, ml=None, seconds=None):
        logging.debug(f'command pumpId={_id}, ml={ml}, seconds={seconds}')
        pump = pump_service.get_by_id(_id)
        execute_pump(pump=pump, ml=ml, seconds=seconds)


@api.route('/commands/port/<int:port>/seconds/<int:seconds>')
@api.route('/commands/port/<int:port>/ml/<int:ml>')
class PortCommands(Resource):
    def post(self, port, ml=None, seconds=None):
        logging.debug(f'command port={port}, ml={ml}, seconds={seconds}')
        pump = pump_service.get_by_port(port)
        execute_pump(pump=pump, ml=ml, seconds=seconds)


@api.route('/commands/receipt/id/<string:_id>')
@api.route('/commands/receipt/name/<string:name>')
class RecipeCommands(Resource):
    def post(self, _id=None, name=None):
        logging.debug(f'command recipe id={_id}, name={name}')
        if name is not None:
            url = f"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={name}"
        else:
            url = f"https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={_id}"

        r = requests.get(url)
        if r.status_code != 200:
            flask.abort(r.status_code, r.text)

        response = json.loads(r.text)
        logging.debug(response)
        if response['drinks'] is None:
            flask.abort(404, 'Recipe not found')

        try:
            pump_commands.execute_recipe(response['drinks'][0])
        except requests.exceptions.RequestException as e:
            logging.error(e)
            flask.abort(400, "Error while calling the machine")
        except PumpInUseException as e:
            logging.error(e)
            flask.abort(400, "Pump in use")
        except BadRequestException as e:
            logging.error(e)
            flask.abort(400, message=e.message, status=e.status)
        except Exception as e:
            logging.error(e)
            flask.abort(400, f"Error {e}")
