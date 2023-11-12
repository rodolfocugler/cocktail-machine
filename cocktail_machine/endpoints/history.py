import logging

from flask_restx import Namespace, Resource

from cocktail_machine import config, database

api = Namespace('history')

conf = config.Config()


@api.route('/histories')
class HistoryList(Resource):

    @api.doc('/', security='auth')
    def get(self):
        logging.debug(f'get histories')
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute('select array_agg(row_to_json(t)) from (select * from history order by timestamp desc limit 100) t;')
        response = cur.fetchall()[0][0]
        conn.close()
        return response