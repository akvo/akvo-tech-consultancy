#!/usr/bin/env bash

set -eu

#cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/2scale" \
       --workdir /home/tcakvo/public_html/2scale \
       --entrypoint /bin/sh \
       composer:1.10.17 -c 'composer install'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/2scale" \
       --workdir /home/tcakvo/public_html/2scale \
       --entrypoint /bin/sh \
       composer:1.10.17 -c 'composer dump-autoload'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/2scale" \
       --workdir "/home/tcakvo/public_html/2scale" \
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && npm run prod'
