FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y apache2 libapache2-mod-wsgi libpq5 redis-server git-core nginx wget solr-jetty && \
    rm -rf /var/cache/apt/*

WORKDIR /root

RUN wget -q http://packaging.ckan.org/python-ckan_2.8-xenial_amd64.deb && \
    dpkg -i python-ckan_2.8-xenial_amd64.deb && \
    rm python-ckan_2.8-xenial_amd64.deb

RUN mv /etc/solr/conf/schema.xml /etc/solr/conf/schema.xml.bak
RUN ln -s /usr/lib/ckan/default/src/ckan/ckan/config/solr/schema.xml /etc/solr/conf/schema.xml
RUN chown www-data:www-data /usr/lib/ckan/default/src/ckan/ckan/public/base/i18n/
COPY solr.config.txt /etc/default/jetty8
COPY start.sh /root/start.sh

CMD [ "/root/start.sh" ]