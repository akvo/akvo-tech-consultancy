#!/usr/bin/env bash

set -eu

#cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-data" \
       --workdir /home/tcakvo/public_html/flow-data \
       --entrypoint /bin/sh \
       composer -c 'composer install'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-data " \
       --workdir /home/tcakvo/public_html/flow-data \
       --entrypoint /bin/sh \
       composer -c 'composer dump-autoload'
