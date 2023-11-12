import json
import logging
import flask

import psycopg2
import requests
from flask_restx import fields, Namespace, Resource

from cocktail_machine import config, database

api = Namespace('favorite')

conf = config.Config()

model = api.model('Favorite', {
    'id': fields.Integer(readonly=True),
    'recipeId': fields.Integer(required=True),
})


@api.route('/favorites')
class FavoriteList(Resource):

    @api.doc('/', security='auth')
    def get(self):
        logging.debug(f'get favorites')
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute(
            'select array_agg(row_to_json(t)) from (select * from favorite order by id) t;')
        response = cur.fetchall()[0][0]
        conn.close()
        return response

    @api.doc('/', security='auth')
    @api.expect(model, validate=True)
    def post(self):
        logging.debug(f'creating a favorite {api.payload}')

        conn = database.get_connection()
        try:
            cur = conn.cursor()
            cur.execute('INSERT INTO favorite (recipeId) VALUES(%s) RETURNING id;',
                        ([api.payload['recipeId']]))
            api.payload['_id'] = cur.fetchone()[0]
            conn.commit()
            return api.payload
        except psycopg2.errors.UniqueViolation:
            flask.abort(409, 'Resource already exists')
        finally:
            conn.close()


@api.route('/favorites/drinks')
class Favorites(Resource):

    @api.doc('/', security='auth')
    def get(self):
        favorites = FavoriteList().get()
        drinks = []
        if favorites is not None:
            for favorite in favorites:
                r = requests.get(f'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={favorite["recipeid"]}')
                response = json.loads(r.text)['drinks'][0]
                drinks.append(response)

        return {"drinks": drinks}


@api.route('/favorites/drinks/<int:recipeId>')
class Favorites(Resource):

    @api.doc('/<int:recipeId>', security='auth')
    def delete(self, recipeId):
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute('DELETE from favorite WHERE recipeId=%s;', [recipeId])
        conn.commit()
        conn.close()
        if cur.rowcount == 0:
            flask.abort(404, 'Resource not found')
