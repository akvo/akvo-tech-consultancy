import os

PSQL_USER = os.environ['PSQL_USER']
PSQL_PWD = os.environ['PSQL_PWD']
PSQL_DB = os.environ['PSQL_DB']
PSQL_HOST = os.environ['PSQL_HOST']

def engine_url():
    return "postgresql://{}:{}@{}/{}".format(PSQL_USER, PSQL_PWD, PSQL_HOST, PSQL_DB)
