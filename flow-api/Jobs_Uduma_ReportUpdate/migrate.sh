migrate manage manage.py --repository=migration --url=postgresql://$PSQL_USER:$PSQL_PWD@localhost/uduma
python migrate.py upgrade
