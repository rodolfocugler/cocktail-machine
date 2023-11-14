import psycopg2

from cocktail_machine import config

conf = config.Config()


def get_connection():
    return psycopg2.connect(conf.DATABASE_URL)


def crete_tables():
    conn = get_connection()
    cur = conn.cursor()

    if conf.RECREATE_DATABASE:
        cur.execute(f"""
            DROP TABLE IF EXISTS history;
            DROP TABLE IF EXISTS pump;
            DROP TABLE IF EXISTS machine;
            DROP TABLE IF EXISTS favorite;
            DROP TABLE IF EXISTS recipe;
        """)

    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS machine
    (
        id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255) NOT NULL UNIQUE,
        domain VARCHAR (255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS pump
    (
        id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255) NOT NULL,
        port INT NOT NULL,
        flowRateInMlPerSec FLOAT NOT NULL,
        machineId INT NOT NULL,
        ingredientId INT NOT NULL,
        UNIQUE(machineId, name),
        UNIQUE(machineId, port),
        UNIQUE(machineId, ingredientId),
        CONSTRAINT fk_machine
            FOREIGN KEY(machineId) 
            REFERENCES machine(id)
    );
    
    CREATE TABLE IF NOT EXISTS history
    (
        id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
        timestamp BIGINT NOT NULL,
        name TEXT NOT NULL,
        port TEXT NOT NULL,
        seconds TEXT NOT NULL,
        flowRateInMlPerSec TEXT NOT NULL,
        machineName VARCHAR (255) NOT NULL,
        domain VARCHAR (255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS recipe
    (
        \"idDrink\" INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
        \"strDrink\" VARCHAR (255) NOT NULL,
        \"strTags\" VARCHAR (255),
        \"strCategory\" VARCHAR (255),
        \"strIBA\" VARCHAR (255),
        \"strAlcoholic\" VARCHAR (255),
        \"strGlass\" VARCHAR (255),
        \"strInstructions\" TEXT,
        \"strDrinkThumb\" VARCHAR (255),
        \"strIngredient1\" VARCHAR (255) NOT NULL,
        \"strIngredient2\" VARCHAR (255),
        \"strIngredient3\" VARCHAR (255),
        \"strIngredient4\" VARCHAR (255),
        \"strIngredient5\" VARCHAR (255),
        \"strIngredient6\" VARCHAR (255),
        \"strIngredient7\" VARCHAR (255),
        \"strIngredient8\" VARCHAR (255),
        \"strIngredient9\" VARCHAR (255),
        \"strIngredient10\" VARCHAR (255),
        \"strIngredient11\" VARCHAR (255),
        \"strIngredient12\" VARCHAR (255),
        \"strIngredient13\" VARCHAR (255),
        \"strIngredient14\" VARCHAR (255),
        \"strIngredient15\" VARCHAR (255),
        \"strMeasure1\" VARCHAR (255) NOT NULL,
        \"strMeasure2\" VARCHAR (255),
        \"strMeasure3\" VARCHAR (255),
        \"strMeasure4\" VARCHAR (255),
        \"strMeasure5\" VARCHAR (255),
        \"strMeasure6\" VARCHAR (255),
        \"strMeasure7\" VARCHAR (255),
        \"strMeasure8\" VARCHAR (255),
        \"strMeasure9\" VARCHAR (255),
        \"strMeasure10\" VARCHAR (255),
        \"strMeasure11\" VARCHAR (255),
        \"strMeasure12\" VARCHAR (255),
        \"strMeasure13\" VARCHAR (255),
        \"strMeasure14\" VARCHAR (255),
        \"strMeasure15\" VARCHAR (255),
        \"strImageSource\" VARCHAR (255),
        \"strImageAttribution\" VARCHAR (255)
    );
    
    CREATE TABLE IF NOT EXISTS favorite
    (
        id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
        recipeId int,
        type INT NOT NULL,
        UNIQUE (recipeId, type)
    );
    """)
    conn.commit()
    conn.close()


def init():
    crete_tables()

    if conf.DUMMY_DATABASE:
        conn = get_connection()
        machine = {'name': 'ESP8266', 'domain': 'http://localhost:5000'}
        cur = conn.cursor()
        cur.execute('INSERT INTO machine (name, domain) VALUES(%s, %s) RETURNING id;',
                    (machine['name'], machine['domain']))
        machine['_id'] = cur.fetchone()[0]

        pumps = [
            {'name': 'Tequila', 'port': 0, 'flowRateInMlPerSec': 25, 'machineId': machine['_id'], 'ingredientId': 4},
            {'name': 'Gin', 'port': 1, 'flowRateInMlPerSec': 50, 'machineId': machine['_id'], 'ingredientId': 2},
            {'name': 'Vodka', 'port': 2, 'flowRateInMlPerSec': 25, 'machineId': machine['_id'], 'ingredientId': 1},
            {'name': 'Rum', 'port': 3, 'flowRateInMlPerSec': 50, 'machineId': machine['_id'], 'ingredientId': 3},
            {'name': 'Water', 'port': 4, 'flowRateInMlPerSec': 50, 'machineId': machine['_id'], 'ingredientId': 513},
            {'name': 'Whiskey', 'port': 5, 'flowRateInMlPerSec': 50, 'machineId': machine['_id'], 'ingredientId': 600},
        ]
        for pump in pumps:
            cur.execute("""INSERT INTO pump (name, port, flowRateInMlPerSec, machineId, ingredientId) VALUES
                            (%s, %s, %s, %s, %s);""",
                        (pump['name'], pump['port'], pump['flowRateInMlPerSec'], pump['machineId'],
                         pump['ingredientId']))

        conn.commit()
        conn.close()
