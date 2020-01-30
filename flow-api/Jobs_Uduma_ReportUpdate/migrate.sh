python migrations/manage.py version_control postgresql://$PSQL_USER:$PSQL_PWD@localhost/angkorsalad migrations
migrate manage manage.py --repository=migrations --url=postgresql://$PSQL_USER:$PSQL_PWD@localhost/angkorsalad
python manage.py upgrade
