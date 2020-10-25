#!/usr/bin/env bash

set -eu

#cp .env.prod .env
echo "Install Composer"

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/flow-data" \
       --workdir /home/tcakvo/public_html/flow-data \
       --entrypoint /bin/sh \
       composer -c 'composer install'
