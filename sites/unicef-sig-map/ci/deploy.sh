#!/usr/bin/env bash

set -eu

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

# Make sure public folder is not writable by others
chmod 755 public

rm -rf node_modules

rsync --archive \
      --verbose \
      --compress \
      --progress \
      --exclude=ci \
      --rsh="ssh -i ${SITES_SSH_KEY} -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
      . tcakvo@109.73.232.40:/home/tcakvo/public_html/unicef-sig-map/
