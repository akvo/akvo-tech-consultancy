#!/usr/bin/env bash

sql=$(printf '%s\n' "$DB_URL" | sed 's:[\/&]:\\&:g;$!s/$/\\/')
read_db=$(printf '%s\n' "$DATASTORE_READ_DB" | sed 's:[\/&]:\\&:g;$!s/$/\\/')
write_db=$(printf '%s\n' "$DATASTORE_WRITE_DB" | sed 's:[\/&]:\\&:g;$!s/$/\\/')

sed -i /etc/ckan/default/production.ini \
    -e 's/ckan.site_url.*/ckan.site_url = https:\/\/ckan.akvotest.org\//' \
    -e "s/sqlalchemy.url.*/sqlalchemy.url = $sql/" \
    -e '/^ckan.plugins =/ s/$/ datastore datapusher/' \
    -e "s/#ckan.datastore.read_url.*/ckan.datastore.read_url  = $read_db/" \
    -e "s/#ckan.datastore.write_url.*/ckan.datastore.write_url = $write_db/" \
    -e "s/#ckan.storage_path.*/ckan.storage_path = \/var\/lib\/ckan\/storage/" \
    -e "s/#ckan.datapusher.url.*/ckan.datapusher.url = http:\/\/127.0.0.1:8800\//"

if [[ ! -d "/var/lib/ckan/storage" ]]; then
    mkdir -p /var/lib/ckan/storage
    chown www-data:www-data /var/lib/ckan/storage
fi

if [[ ! -d "/var/lib/solr/data/" ]]; then
    mkdir -p /var/lib/solr/data/
    chown jetty:jetty /var/lib/solr/data/
fi

service redis-server start
service jetty8 restart
service apache2 restart
service nginx restart

tail -f /dev/null