#!/usr/bin/env bash

set -eu

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/tap-lumen-pages" \
       --workdir /home/tcakvo/public_html/tap-lumen-pages\
       --entrypoint /bin/sh \
