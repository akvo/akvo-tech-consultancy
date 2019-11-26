#!/usr/bin/env bash

set -eu

cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/2scale" \
       --workdir /home/tcakvo/public_html/2scale \
       --entrypoint /bin/sh \
       composer -c 'composer install && php artisan key:generate && php artisan cache:clear'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/2scale" \
       --workdir "/home/tcakvo/public_html/2scale" \
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && npm run prod'
