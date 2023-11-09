import logging

from flask_restx import fields, Namespace, Resource

from cocktail_machine import config
from cocktail_machine.services import pump_service

api = Namespace('pumps')

conf = config.Config()

model = api.model('Pump', {
    'id': fields.Integer(readonly=True),
    'name': fields.String(required=True),
    'port': fields.Integer(required=True),
    'flowRateInMlPerSec': fields.Float(required=True),
    'machineId': fields.Integer(required=True),
    'ingredientId': fields.Integer(required=True),
})


@api.route('/pumps')
class PumpList(Resource):

    @api.doc('/', security='auth')
    def get(self):
        logging.debug(f'get pumps')
        return pump_service.get()

    @api.doc('/', security='auth')
    @api.expect(model)
    def post(self):
        logging.debug(f'creating a pump {api.payload}')
        return pump_service.post(api.payload)


@api.route('/pumps/<int:_id>')
class Pumps(Resource):

    @api.doc('/<int:_id>', security='auth')
    def get(self, _id):
        logging.debug(f'get pump {_id}')
        return pump_service.get_by_id(_id)

    @api.doc('/<int:_id>', security='auth')
    @api.expect(model)
    def put(self, _id):
        logging.debug(f'put pump {_id}')
        return pump_service.put(_id, api.payload)

    @api.doc('/<int:_id>', security='auth')
    def delete(self, _id):
        logging.debug(f'delete pump {_id}')
        pump_service.delete(_id)
