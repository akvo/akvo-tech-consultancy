#!/usr/bin/env bash

set -eu

#cp .env.prod .env


docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-kenya-5w" \
       --workdir /home/tcakvo/public_html/unicef-kenya-5w\
       --entrypoint /bin/sh \
       composer -c 'composer install'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-kenya-5w" \
       --workdir /home/tcakvo/public_html/unicef-kenya-5w\
       --entrypoint /bin/sh \
       composer -c 'composer dump-autoload'

docker run \
       --rm \
       --volume "$(pwd):/home/tcakvo/public_html/unicef-kenya-5w" \
       --workdir /home/tcakvo/public_html/unicef-kenya-5w\
       --entrypoint /bin/sh \
       --env MIX_PUBLIC_URL="https://covid-ke5w.tc.akvo.org" \
       node:8-alpine -c 'npm i && npm run prod'
