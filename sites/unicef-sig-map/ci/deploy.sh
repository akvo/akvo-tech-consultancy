#!/usr/bin/env bash

set -eu

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

rm -rf node_modules

rsync --archive \
      --quiet \
      --times \
      --compress \
      --progress \
      --exclude=ci \
      --rsh="ssh -i ${SITES_SSH_KEY} -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
      . tcakvo@109.73.232.40:/home/tcakvo/public_html/unicef-sig-map/
