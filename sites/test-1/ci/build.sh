#!/usr/bin/env bash

set -eu

cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/test-1" \
       --workdir "/home/tcakvo/public_html/test-1" \
       --entrypoint /bin/sh \
       composer:1.8.0 -c 'composer install && php artisan key:generate && php artisan cache:clear'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/test-1" \
       --workdir "/home/tcakvo/public_html/test-1" \
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && npm run prod'
