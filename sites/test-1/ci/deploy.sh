#!/usr/bin/env bash

set -eu

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:${USER}" . -R

echo "Deploying site..."

rsync \
    --archive \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
    --rsh="ssh -i ${SITES_SSH_KEY} -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
    . tcakvo@109.73.232.40:/home/tcakvo/public_html/test-1/

echo "Fixing permissions..."

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 'find  ~/public_html/test-1/ -not -path "*.well-known*" -type f -print0 | xargs -0 -n1 chmod 644'

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 'find ~/public_html/test-1/ -type d -print0 | xargs -0 -n1 chmod 755'

echo "Clearing cache..."

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 'find ~/public_html/test-1/storage/framework/cache/data | xargs rm -rf'

echo "Done"
