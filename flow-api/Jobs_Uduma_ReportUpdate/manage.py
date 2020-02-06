#!/usr/bin/env python
from migrate.versioning.shell import main
from os import environ

pwd = environ['PSQL_PWD']
host = environ['PSQL_HOST']

postgres_url = 'postgresql://postgres:{}@{}/uduma_report'.format(pwd, host)

if __name__ == '__main__':
    main(repository='migrations', url=postgres_url, debug='False')
