#!/usr/bin/env bash

set -eu

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/anu" \
       --workdir /home/tcakvo/public_html/anu\
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && webpack'
