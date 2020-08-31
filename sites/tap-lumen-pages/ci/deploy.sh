#!/usr/bin/env bash

set -eu

rsync --version

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

echo "Deploying site..."

if [[ "${TRAVIS_BRANCH}" != "master" && "${TRAVIS_BRANCH}" != "sites/tap-lumen-pages" ]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

FOLDER="tap-lumen-pages"

cp .htaccess ./dist
cd dist

rsync \
    --archive \
    --compress \
    --progress \
    --exclude=ci \
    --rsh="ssh -i ${SITES_SSH_KEY} -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
    . tcakvo@35.214.170.100:/home/tcakvo/public_html/$FOLDER/

echo "Fixing permissions..."

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@35.214.170.100 "find ~/public_html/${FOLDER}/ -not -path "*.well-known*" -type f -print0 | xargs -0 -n1 chmod 644"

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@35.214.170.100 "find ~/public_html/${FOLDER}/ -type d -print0 | xargs -0 -n1 chmod 755"

echo "Done"
