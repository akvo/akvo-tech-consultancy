#!/usr/bin/env bash

set -eu

#cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-gateway" \
       --workdir /home/tcakvo/public_html/flow-gateway \
       --entrypoint /bin/sh \
       composer -c 'composer install'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-gateway" \
       --workdir /home/tcakvo/public_html/flow-gateway \
       --entrypoint /bin/sh \
       composer -c 'composer dump-autoload'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-gateway" \
       --workdir "/home/tcakvo/public_html/flow-gateway" \
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && npm run prod'
