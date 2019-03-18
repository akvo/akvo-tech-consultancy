#!/usr/bin/env bash

sql=$(printf '%s\n' "$DB_URL" | sed 's:[\/&]:\\&:g;$!s/$/\\/')

sed -i /etc/ckan/default/production.ini -e 's/ckan.site_url.*/ckan.site_url = https:\/\/ckan.akvotest.org\//' -e "s/sqlalchemy.url.*/sqlalchemy.url = $sql/"

service redis-server start
service jetty8 restart
service apache2 restart
service nginx restart

tail -f /dev/null