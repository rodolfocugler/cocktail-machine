import logging

import requests
from flask_restx import fields, Namespace, Resource

from cocktail_machine import config
from cocktail_machine.services import machine_service

api = Namespace('machines')

conf = config.Config()

model = api.model('Machine', {
    'id': fields.Integer(readonly=True),
    'name': fields.String(required=True),
    'domain': fields.String(required=True),
})


@api.route('/machines')
class MachineList(Resource):

    @api.doc('/', security='auth')
    def get(self):
        logging.debug(f'get machines')
        return machine_service.get()

    @api.doc('/', security='auth')
    @api.expect(model, validate=True)
    def post(self):
        logging.debug(f'creating a machine {api.payload}')
        return machine_service.post(api.payload)


@api.route('/machines/<int:_id>')
class Machines(Resource):

    @api.doc('/<int:_id>', security='auth')
    def get(self, _id):
        logging.debug(f'get machine {_id}')
        return machine_service.get_by_id(_id)

    @api.doc('/<int:_id>', security='auth')
    @api.expect(model, validate=True)
    def put(self, _id):
        logging.debug(f'put machine {_id}')
        return machine_service.put(_id, api.payload)

    @api.doc('/<int:_id>', security='auth')
    def delete(self, _id):
        logging.debug(f'delete machine {_id}')
        return machine_service.delete(_id)


@api.route('/machines/<int:_id>/health')
class MachinesHealth(Resource):

    @api.doc('/<int:_id>/health', security='auth')
    def get(self, _id):
        machine = Machines().get(_id)
        r = requests.post(f'{machine["domain"]}/api/health')
        return r.text, r.status_code
