import os

PSQL_USER = 'dedenbangkit'
PSQL_PWD = os.environ['KEYCLOAK_PWD']
PSQL_DB = 'uat2'

def engine_url():
    return "postgresql://{}:{}@localhost/{}".format(PSQL_USER, PSQL_PWD, PSQL_DB)
