#!/usr/bin/env bash

set -eu

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/wai-lumen-pages" \
       --workdir /home/tcakvo/public_html/wai-lumen-pages\
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && node ./node_modules/webpack/bin/webpack.js'
