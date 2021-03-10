#! /usr/bin/env sh
set -eu

# docker cp .docker/sql/tcakvo_2scale.sql 2scale_db_1:/2scale.sql

cat .docker/sql/tcakvo_2scale.sql | docker exec -i 2scale_db_1 mysql -u akvo --password=secret akvo;