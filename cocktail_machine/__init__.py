import logging
import os

from flask import Flask
from flask_basicauth import BasicAuth
from flask_cors import CORS


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY=os.urandom(16))

    from cocktail_machine import config
    conf = config.Config()
    app.config.from_object(conf)

    from cocktail_machine.endpoints import api
    api.init_app(app)
    CORS(app, resources={r"*": {"origins": [conf.CORS, "http://localhost*"]}})

    configure_logging()

    if conf.BASIC_AUTH_FORCE:
        BasicAuth(app)
    from cocktail_machine import database
    database.init()
    return app


def configure_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    stdout_handler = logging.StreamHandler()
    formatter = logging.Formatter(fmt="%(asctime)s %(pathname)s:%(lineno)d - %(levelname)s - %(message)s",
                                  datefmt="%d-%b-%y %H:%M:%S")
    stdout_handler.setFormatter(formatter)
    logger.addHandler(stdout_handler)
