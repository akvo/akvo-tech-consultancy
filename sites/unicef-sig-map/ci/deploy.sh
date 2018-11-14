#!/usr/bin/env bash

set -eu

sudo chown "${USER}:" . -R

rm -rf node_modules

rsync -avz --exclude=ci -e "ssh -i ${SITES_SSH_KEY} -p 18765" --progress . tcakvo@109.73.232.40:/home/tcakvo/public_html/unicef-sig-map/
