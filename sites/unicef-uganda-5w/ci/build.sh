#!/usr/bin/env bash

set -eu

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-uganda-5w" \
       --workdir /home/tcakvo/public_html/unicef-uganda-5w\
       --entrypoint /bin/sh \
       composer -c 'composer install'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-uganda-5w" \
       --workdir /home/tcakvo/public_html/unicef-uganda-5w\
       --entrypoint /bin/sh \
       composer -c 'composer dump-autoload'

echo 'MIX_PUBLIC_URL="https://covid-ug5w.tc.akvo.org"' > .env

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-uganda-5w" \
       --workdir /home/tcakvo/public_html/unicef-uganda-5w\
       --entrypoint /bin/sh \
       node:8-alpine -c 'npm i && npm run prod'
