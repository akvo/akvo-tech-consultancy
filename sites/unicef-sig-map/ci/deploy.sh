#!/usr/bin/env bash

set -eu

RSYNC_IMAGE="instrumentisto/rsync-ssh"
SSH_KEY_PATH="$(dirname ${SITES_SSH_KEY})"

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

docker run --rm --tty "${RSYNC_IMAGE}" rsync --version

echo "Deploying site..."

docker run \
    --rm \
    --tty \
    --volume="$(pwd):/app" \
    --volume="${SSH_KEY_PATH}:/ssh-key" \
    --workdir /app \
    "${RSYNC_IMAGE}" rsync \
    --archive \
    --verbose \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
    --rsh="ssh -i /ssh-key/id_rsa -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
    . tcakvo@109.73.232.40:/home/tcakvo/public_html/unicef-sig-map/

echo "Done"
