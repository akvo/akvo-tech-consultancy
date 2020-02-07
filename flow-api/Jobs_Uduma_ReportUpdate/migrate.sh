#!/usr/bin/env bash

set -eu

: '
python migrations/manage.py version_control "postgresql://$PSQL_USER:$PSQL_PWD@$PSQL_HOST/uduma_report" migrations
migrate manage manage.py --repository=migrations --url="postgresql://$PSQL_USER:$PSQL_PWD@$PSQL_HOST/uduma_report"
python manage.py upgrade
'
python init.py
