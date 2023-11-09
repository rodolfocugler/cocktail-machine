import os


class Config:
    APP_NAME = os.getenv("FLASK_APP")

    BASIC_AUTH_USERNAME = os.getenv("BASIC_AUTH_USERNAME", "admin")
    BASIC_AUTH_PASSWORD = os.getenv("BASIC_AUTH_PASSWORD", "123456")
    BASIC_AUTH_FORCE = os.getenv("BASIC_AUTH_FORCE", "True") == "True"

    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:123456@localhost/db1")
    RECREATE_DATABASE = os.getenv("RECREATE_DATABASE", "False") == "True"
    DUMMY_DATABASE = os.getenv("DUMMY_DATABASE", "False") == "True"
    CORS = os.getenv("CORS", "http://192.168.178.*")
