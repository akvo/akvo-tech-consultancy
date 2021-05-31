#!/usr/bin/env bash

set -eu

#cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-gateway" \
       --workdir /home/tcakvo/public_html/flow-gateway \
       --entrypoint /bin/sh \
       composer:1.10.17 -c 'composer install'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-gateway" \
       --workdir /home/tcakvo/public_html/flow-gateway \
       --entrypoint /bin/sh \
       composer:1.10.17 -c 'composer install'
