#!/usr/bin/env bash

sql=$(printf '%s\n' "$DB_URL" | sed 's:[\/&]:\\&:g;$!s/$/\\/')

sed -i /etc/ckan/default/production.ini -e 's/ckan.site_url.*/ckan.site_url = https:\/\/ckan.akvotest.org\//' -e "s/sqlalchemy.url.*/sqlalchemy.url = $sql/" -e '/^ckan.plugins =/ s/$/ datastore datapusher/'

echo "ckan.datastore.read_url = $DATASTORE_READ_DB" >> /etc/ckan/default/production.ini
echo "ckan.datastore.write_url = $DATASTORE_WRITE_DB" >> /etc/ckan/default/production.ini
echo "ckan.datapusher.url = http://127.0.0.1:8800/" >> /etc/ckan/default/production.ini
echo "ckan.storage_path = /var/lib/ckan/storage" >> /etc/ckan/defaul/production.ini

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