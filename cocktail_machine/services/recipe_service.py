import flask
import psycopg2

from cocktail_machine import database


def get():
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute("""select array_agg(row_to_json(t)) from 
                    (select * from recipe order by \"idDrink\") t;""")
    response = cur.fetchall()[0][0]
    conn.close()
    if response is None:
        return {'drinks': []}
    return {'drinks': response}


def get_payload(payload, names):
    return [payload[name] if name in payload else None for name in names]


def post(payload):
    conn = database.get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO recipe (
            \"strDrink\", \"strTags\", \"strCategory\", \"strIBA\", \"strAlcoholic\", \"strGlass\", \"strInstructions\",
             \"strDrinkThumb\", \"strIngredient1\", \"strIngredient2\", \"strIngredient3\", \"strIngredient4\",
              \"strIngredient5\", \"strIngredient6\", \"strIngredient7\", \"strIngredient8\", \"strIngredient9\", 
              \"strIngredient10\", \"strIngredient11\", \"strIngredient12\", \"strIngredient13\", \"strIngredient14\",
               \"strIngredient15\", \"strMeasure1\", \"strMeasure2\", \"strMeasure3\", \"strMeasure4\",
               \"strMeasure5\", \"strMeasure6\", \"strMeasure7\", \"strMeasure8\", \"strMeasure9\", 
               \"strMeasure10\", \"strMeasure11\", \"strMeasure12\", \"strMeasure13\", \"strMeasure14\", 
               \"strMeasure15\", \"strImageSource\", \"strImageAttribution\")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                 %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
                RETURNING \"idDrink\";""",
            (get_payload(payload,
                         ['strDrink', 'strTags', 'strCategory', 'strIBA', 'strAlcoholic', 'strGlass', 'strInstructions',
                          'strDrinkThumb', 'strIngredient1', 'strIngredient2', 'strIngredient3', 'strIngredient4',
                          'strIngredient5', 'strIngredient6', 'strIngredient7', 'strIngredient8', 'strIngredient9',
                          'strIngredient10', 'strIngredient11', 'strIngredient12', 'strIngredient13', 'strIngredient14',
                          'strIngredient15', 'strMeasure1', 'strMeasure2', 'strMeasure3', 'strMeasure4', 'strMeasure5',
                          'strMeasure6', 'strMeasure7', 'strMeasure8', 'strMeasure9''strMeasure10', 'strMeasure11',
                          'strMeasure12', 'strMeasure13', 'strMeasure14', 'strMeasure15', 'strImageSource',
                          'strImageAttribution'])))
        payload['idDrink'] = cur.fetchone()[0]
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
                (select * from recipe where \"idDrink\" = %s) t;""", [_id])
    response = cur.fetchone()
    conn.close()
    if response is None:
        flask.abort(404, 'Resource not found')
    return {'drinks': response}


def put(_id, payload):
    conn = database.get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """UPDATE recipe SET \"strDrink\" = %s, \"strTags\" = %s, \"strCategory\" = %s, \"strIBA\" = %s, 
            \"strAlcoholic\" = %s, \"strGlass\" = %s, \"strInstructions\" = %s, \"strDrinkThumb\" = %s, 
            \"strIngredient1\" = %s, \"strIngredient2\" = %s, \"strIngredient3\" = %s, \"strIngredient4\" = %s, 
            \"strIngredient5\" = %s, \"strIngredient6\" = %s, \"strIngredient7\" = %s, \"strIngredient8\" = %s, 
            \"strIngredient9\" = %s, \"strIngredient10\" = %s, \"strIngredient11\" = %s, \"strIngredient12\" = %s,
             \"strIngredient13\" = %s, \"strIngredient14\" = %s, \"strIngredient15\" = %s, \"strMeasure1\" = %s, 
             \"strMeasure2\" = %s, \"strMeasure3\" = %s, \"strMeasure4\" = %s, \"strMeasure5\" = %s, 
             \"strMeasure6\" = %s, \"strMeasure7\" = %s, \"strMeasure8\" = %s, \"strMeasure9\" = %s, 
             \"strMeasure10\" = %s, \"strMeasure11\" = %s, \"strMeasure12\" = %s, \"strMeasure13\" = %s, 
             \"strMeasure14\" = %s, \"strMeasure15\" = %s, \"strImageSource\" = %s, \"strImageAttribution\" = %s
              WHERE \"idDrink\" = %s;""",
            (get_payload(payload, ['strDrink', 'strTags', 'strCategory', 'strIBA', 'strAlcoholic',
                                   'strGlass', 'strInstructions', 'strDrinkThumb', 'strIngredient1', 'strIngredient2',
                                   'strIngredient3', 'strIngredient4', 'strIngredient5', 'strIngredient6',
                                   'strIngredient7', 'strIngredient8', 'strIngredient9', 'strIngredient10',
                                   'strIngredient11', 'strIngredient12', 'strIngredient13', 'strIngredient14',
                                   'strIngredient15', 'strMeasure1', 'strMeasure2', 'strMeasure3', 'strMeasure4',
                                   'strMeasure5', 'strMeasure6', 'strMeasure7', 'strMeasure8', 'strMeasure9',
                                   'strMeasure10', 'strMeasure11', 'strMeasure12', 'strMeasure13', 'strMeasure14',
                                   'strMeasure15', 'strImageSource', 'strImageAttribution']) + [_id]))
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
    cur.execute('DELETE from favorite WHERE recipeId=%s and type=2; DELETE from recipe WHERE \"idDrink\"=%s;',
                (_id, _id))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        flask.abort(404, 'Resource not found')
