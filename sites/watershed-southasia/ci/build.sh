#!/usr/bin/env bash

set -eu

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/watershedchart" \
       --workdir "/home/tcakvo/public_html/watershedchart/indiabaseline" \
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && npm run build'
