#!/usr/bin/env bash

set -eu

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-sig-map" \
       --workdir /home/tcakvo/public_html/unicef-sig-map \
       --entrypoint /bin/sh \
       composer -c 'composer install && php artisan key:generate && php artisan cache:clear'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-sig-map" \
       --workdir "/home/tcakvo/public_html/unicef-sig-map" \
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && npm run prod'
