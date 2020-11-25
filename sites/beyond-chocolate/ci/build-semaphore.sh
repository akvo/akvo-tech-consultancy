#!/usr/bin/env bash

set -eu

#cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/gisco-demo" \
       --workdir /home/tcakvo/public_html/gisco-demo \
       --entrypoint /bin/sh \
       composer -c 'composer install'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/gisco-demo" \
       --workdir "/home/tcakvo/public_html/gisco-demo" \
       --entrypoint /bin/sh \
       node:14-alpine -c 'npm i && npm run prod'

