import flask
import psycopg2

from cocktail_machine import database


def get():
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute('select array_agg(row_to_json(t)) from (select * from machine) t;')
    response = cur.fetchall()[0][0]
    conn.close()
    return response


def post(payload):
    conn = database.get_connection()
    try:
        cur = conn.cursor()
        cur.execute('INSERT INTO machine (name, domain) VALUES(%s, %s) RETURNING id;',
                    (payload['name'], payload['domain']))
        payload['_id'] = cur.fetchone()[0]
        conn.commit()
        return payload
    except psycopg2.errors.UniqueViolation:
        flask.abort(409, 'Resource already exists')
    finally:
        conn.close()


def get_by_id(_id):
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute('select row_to_json(t) from (select * from machine where id = %s) t;', [_id])
    response = cur.fetchone()
    conn.close()
    if response is None:
        flask.abort(404, 'Resource not found')
    return response[0]


def put(_id, payload):
    conn = database.get_connection()
    try:
        cur = conn.cursor()
        cur.execute('UPDATE machine SET name=%s, domain=%s WHERE id=%s;',
                    (payload['name'], payload['domain'], _id))
        conn.commit()
        conn.close()
        if cur.rowcount == 0:
            flask.abort(404, 'Resource not found')

        return payload
    except psycopg2.errors.UniqueViolation:
        conn.close()
        flask.abort(409, 'Resource already exists')


def delete(_id):
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute('DELETE from machine WHERE id=%s;', [_id])
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        flask.abort(404, 'Resource not found')
