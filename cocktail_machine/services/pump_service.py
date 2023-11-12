import flask
import psycopg2

from cocktail_machine import database


def get():
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute("""select array_agg(row_to_json(t)) from 
                    (select p.*, m.id as "machineid", m.name as "machinename", m.domain as "machinedomain" from pump p 
                inner join machine m on m.id = p.machineId order by p.id) t;""")
    response = cur.fetchall()[0][0]
    conn.close()
    if response is None:
        return []
    return [_map(r) for r in response]


def post(payload):
    conn = database.get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO pump (name, port, flowRateInMlPerSec, machineId, ingredientId) VALUES (%s, %s, %s, %s, %s) RETURNING id;',
            (payload['name'], payload['port'], payload['flowRateInMlPerSec'], payload['machineId'],
             payload['ingredientId']))
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
    cur.execute("""select row_to_json(t) from 
                (select p.*, m.id as "machineid", m.name as "machinename", m.domain as "machinedomain" from pump p
                inner join machine m on m.id = p.machineId 
                where p.id = %s) t;""", [_id])
    response = cur.fetchone()
    conn.close()
    if response is None:
        flask.abort(404, 'Resource not found')
    return _map(response[0])


def get_by_port(_id):
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute("""select row_to_json(t) from 
                (select p.*, m.id as "machineid", m.name as "machinename", m.domain as "machinedomain" from pump p
                inner join machine m on m.id = p.machineId 
                where p.port = %s) t;""", [_id])
    response = cur.fetchone()
    conn.close()
    if response is None:
        flask.abort(404, 'Resource not found')
    return _map(response[0])


def get_by_name(name):
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute("""select row_to_json(t) from 
                (select p.*, m.id as "machineid", m.name as "machinename", m.domain as "machinedomain" from pump p 
                inner join machine m on m.id = p.machineId 
                where LOWER(p.name) = LOWER(%s)) t;""", [name])
    response = cur.fetchone()
    conn.close()
    if response is None:
        flask.abort(404, 'Resource not found')
    return _map(response[0])


def _map(row):
    return {
        'id': row['id'],
        "name": row['name'],
        'port': row['port'],
        'ingredientId': row['ingredientid'],
        'flowRateInMlPerSec': row['flowrateinmlpersec'],
        'machine': {
            'id': row['machineid'],
            'name': row['machinename'],
            'domain': row['machinedomain']
        }
    }


def put(_id, payload):
    conn = database.get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            'UPDATE pump SET name=%s, port=%s, flowRateInMlPerSec=%s, machineId=%s, ingredientId=%s WHERE id=%s;',
            (payload['name'], payload['port'], payload['flowRateInMlPerSec'], payload['machineId'],
             payload['ingredientId'], _id))
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
    cur.execute('DELETE from pump WHERE id=%s;', [_id])
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        flask.abort(404, 'Resource not found')
