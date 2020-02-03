python migrations/manage.py version_control postgresql://$PSQL_USER:$PSQL_PWD@localhost/uat2 uat2
migrate manage manage.py --repository=uat2 --url=postgresql://$PSQL_USER:$PSQL_PWD@localhost/uat2
python manage.py upgrade
