#!/usr/bin/env bash

set -eu

rsync --version

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

if [[ "${TRAVIS_BRANCH}" != "develop" ]] && [[ "${TRAVIS_BRANCH}" != "master" ]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

echo "Deploying analytics..."

FOLDER="analytics"

rsync \
    --archive \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
    --rsh="ssh -i ${SITES_SSH_KEY} -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
    . tcakvo@109.73.232.40:/home/tcakvo/public_html/$FOLDER/

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 "find ~/public_html/${FOLDER}/ -type d -print0 | xargs -0 -n1 chmod 755"

echo "Duplicate analytics..."

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 "cat ~/public_html/${FOLDER}/analytics.js | sed s/#pos#/left/g > ~/public_html/${FOLDER}/analytics-left.js"

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@109.73.232.40 "cat ~/public_html/${FOLDER}/analytics.js | sed s/#pos#/right/g > ~/public_html/${FOLDER}/analytics-right.js"
