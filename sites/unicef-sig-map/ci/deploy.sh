#!/usr/bin/env bash

set -eu

rsync --version

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

echo "Deploying site..."

rsync \
    --archive \
    --verbose \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
    --rsh="ssh -i ${SSH_KEY_PATH} -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
    . tcakvo@109.73.232.40:/home/tcakvo/public_html/unicef-sig-map/

# Fix permissions
ssh -i "${SSH_KEY_PATH}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 'find  ~/public_html/unicef-sig-map/ -type f -print0 | xargs -0 -n1 chmod 644'

ssh -i "${SSH_KEY_PATH}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 'find ~/public_html/unicef-sig-map/ -type d -print0 | xargs -0 -n1 chmod 755'

echo "Done"
