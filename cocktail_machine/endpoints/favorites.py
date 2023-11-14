import json
import logging
import flask

import psycopg2
import requests
from flask_restx import fields, Namespace, Resource

from cocktail_machine import config, database
from cocktail_machine.services import recipe_service

api = Namespace('favorite')

conf = config.Config()

model = api.model('Favorite', {
    'id': fields.Integer(readonly=True),
    'recipeId': fields.Integer(required=True),
    'type': fields.Integer(required=True),
})


@api.route('/favorites')
class FavoriteList(Resource):

    def get(self):
        logging.debug(f'get favorites')
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute(
            'select array_agg(row_to_json(t)) from (select * from favorite order by id) t;')
        response = cur.fetchall()[0][0]
        conn.close()
        if response is None:
            return []

        return response

    @api.expect(model, validate=True)
    def post(self):
        logging.debug(f'creating a favorite {api.payload}')

        conn = database.get_connection()
        try:
            cur = conn.cursor()
            cur.execute('INSERT INTO favorite (recipeId, type) VALUES(%s, %s) RETURNING id;',
                        (api.payload['recipeId'], api.payload['type']))
            api.payload['_id'] = cur.fetchone()[0]
            conn.commit()
            return api.payload
        except psycopg2.errors.UniqueViolation:
            flask.abort(409, 'Resource already exists')
        finally:
            conn.close()


@api.route('/favorites/drinks')
class Favorites(Resource):

    def get(self):
        favorites = FavoriteList().get()
        drinks = []
        if favorites is not None:
            for favorite in favorites:
                if favorite['type'] == 1:
                    r = requests.get(f'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={favorite["recipeid"]}')
                    response = json.loads(r.text)['drinks'][0]
                    response['type'] = 1
                    drinks.append(response)
                elif favorite['type'] == 2:
                    r = recipe_service.get_by_id(favorite['recipeid'])['drinks'][0]
                    r['type'] = 2
                    drinks.append(r)

        return {"drinks": drinks}


@api.route('/favorites/drinks/<int:recipeId>/type/<int:type>')
class Favorites(Resource):

    def delete(self, recipeId, _type):
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute('DELETE from favorite WHERE recipeId=%s and type=%s;', (recipeId, _type))
        conn.commit()
        conn.close()
        if cur.rowcount == 0:
            flask.abort(404, 'Resource not found')
