import logging

import flask
import psycopg2
from flask_restx import fields, Namespace, Resource

from cocktail_machine import config, database

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
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute('select array_agg(row_to_json(t)) from (select * from machine) t;')
        response = cur.fetchall()[0][0]
        conn.close()
        return response

    @api.doc('/', security='auth')
    @api.expect(model, validate=True)
    def post(self):
        logging.debug(f'creating a machine {api.payload}')
        conn = database.get_connection()
        try:
            cur = conn.cursor()
            cur.execute('INSERT INTO machine (name, domain) VALUES(%s, %s) RETURNING id;',
                        (api.payload['name'], api.payload['domain']))
            api.payload['_id'] = cur.fetchone()[0]
            conn.commit()
            return api.payload
        except psycopg2.errors.UniqueViolation:
            flask.abort(409, 'Resource already exists')
        finally:
            conn.close()


@api.route('/machines/<int:_id>')
class Machines(Resource):

    @api.doc('/<int:_id>', security='auth')
    def get(self, _id):
        logging.debug(f'get machine {_id}')
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute('select row_to_json(t) from (select * from machine where id = %s) t;', [_id])
        response = cur.fetchone()
        conn.close()
        if response is None:
            flask.abort(404, 'Resource not found')
        return response[0]

    @api.doc('/<int:_id>', security='auth')
    @api.expect(model, validate=True)
    def put(self, _id):
        logging.debug(f'put machine {_id}')
        conn = database.get_connection()
        try:
            cur = conn.cursor()
            cur.execute('UPDATE machine SET name=%s, domain=%s WHERE id=%s;',
                        (api.payload['name'], api.payload['domain'], _id))
            conn.commit()
            conn.close()
            if cur.rowcount == 0:
                flask.abort(404, 'Resource not found')

            return api.payload
        except psycopg2.errors.UniqueViolation:
            conn.close()
            flask.abort(409, 'Resource already exists')

    @api.doc('/<int:_id>', security='auth')
    def delete(self, _id):
        logging.debug(f'delete machine {_id}')
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute('DELETE from machine WHERE id=%s;', [_id])
        conn.commit()
        conn.close()
        if cur.rowcount == 0:
            flask.abort(404, 'Resource not found')
