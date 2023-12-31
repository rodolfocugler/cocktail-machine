from flask_restx import Api

from cocktail_machine.endpoints.commands import api as ns_commands
from cocktail_machine.endpoints.history import api as ns_history
from cocktail_machine.endpoints.machines import api as ns_machines
from cocktail_machine.endpoints.pumps import api as ns_pumps
from cocktail_machine.endpoints.favorites import api as ns_favorites
from cocktail_machine.endpoints.recipe import api as ns_recipes


def get_authorizations():
    from cocktail_machine import config
    conf = config.Config()
    if conf.BASIC_AUTH_FORCE:
        return {
            "auth": {
                "type": "basic"
            }
        }


api = Api(
    title="Cocktail-Machine",
    version="1.0",
    description="Cocktail-Machine",
    authorizations=get_authorizations(), security="auth"
)

api.add_namespace(ns_pumps, path="/api")
api.add_namespace(ns_machines, path="/api")
api.add_namespace(ns_commands, path="/api")
api.add_namespace(ns_history, path="/api")
api.add_namespace(ns_favorites, path="/api")
api.add_namespace(ns_recipes, path="/api")
