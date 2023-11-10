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
            {'name': 'Gin', 'port': 1, 'flowRateInMlPerSec': 50, 'machineId': machine['_id'], 'ingredientId': 2}
        ]
        cur.execute("""INSERT INTO pump (name, port, flowRateInMlPerSec, machineId, ingredientId) VALUES
                        (%s, %s, %s, %s, %s),
                        (%s, %s, %s, %s, %s);""",
                    (pumps[0]['name'], pumps[0]['port'], pumps[0]['flowRateInMlPerSec'], pumps[0]['machineId'],
                     pumps[0]['ingredientId'],
                     pumps[1]['name'], pumps[1]['port'], pumps[1]['flowRateInMlPerSec'], pumps[1]['machineId'],
                     pumps[1]['ingredientId']))

        conn.commit()
        conn.close()
