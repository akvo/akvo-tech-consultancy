#!/usr/bin/env bash

set -eu

rsync --version

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

echo "Deploying site..."

#if [[ "${TRAVIS_BRANCH}" != "master" && "${TRAVIS_BRANCH}" != "sites/unep-dashboard" ]]; then
#    exit 0
#fi

if [[ "${TRAVIS_BRANCH}" != "master" && "${TRAVIS_BRANCH}" != "sites/unep-dashboard" ]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

FOLDER="unep-dashboard"

if [[ "${TRAVIS_BRANCH}" == "master" ]]; then
	FOLDER="unep-dashboard"
	echo "Deploying Production"
else
	echo "Deploying ${TRAVIS_BRANCH}"
fi

rsync \
    --archive \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
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

echo "Copy the config..."

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@35.214.170.100 "cp ~/etc/tc.akvo.org/${FOLDER}.env.prod ~/public_html/${FOLDER}/.env"

echo "Clearing cache..."

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@35.214.170.100 "cd ~/public_html/${FOLDER}/ && /usr/local/bin/php73 artisan cache:clear"

ssh -i "${SITES_SSH_KEY}" \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    tcakvo@35.214.170.100 "cd ~/public_html/${FOLDER}/ && /usr/local/bin/composer dump-autoload"

echo "Done"
