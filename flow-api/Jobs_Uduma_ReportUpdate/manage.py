#!/usr/bin/env python
from migrate.versioning.shell import main
import os

PSQL_USER=os.environ['PSQL_USER']
PSQL_PWD=os.environ['PSQL_PWD']

if __name__ == '__main__':
    main(repository='migrations', url='postgresql://{}:{}@localhost/uduma'.format(PSQL_USER, PSQL_PWD), debug='False')
