#!/usr/bin/env bash

set -eu

cp .env.prod .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/iucn" \
       --workdir /home/tcakvo/public_html/iucn
