#!/usr/bin/env bash

set -eu

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/ci-fiji-lumen-pages" \
       --workdir /home/tcakvo/public_html/ci-fiji-lumen-pages\
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && node ./node_modules/webpack/bin/webpack.js'
