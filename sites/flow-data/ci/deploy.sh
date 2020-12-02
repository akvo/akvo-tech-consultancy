#!/usr/bin/env bash

set -eu

rsync --version

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

echo "Deploying site..."

exit 0; # TODO : remove this to deploy

if [[ "${TRAVIS_BRANCH}" != "master" && "${TRAVIS_BRANCH}" != "develop" && "${TRAVIS_BRANCH}" != "sites/flow-data" ]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

FOLDER="flow-data"

if [[ "${TRAVIS_BRANCH}" == "master" ]]; then
	FOLDER="flow-data"
	echo "Deploying Production"
else
	echo "Deploying Test"
fi

rsync \
    --archive \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
    --rsh="ssh -i ${SITES_SSH_KEY} -o BatchMode=yes -p 18765 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
    . u7-nnfq7m4dqfyx@35.214.170.100:/home/customer/www/tc.akvo.org/public_html/$FOLDER/

echo "Fixing permissions..."

ssh -i "${SITES_SSH_KEY}" -o BatchMode=yes \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    u7-nnfq7m4dqfyx@35.214.170.100 "find www/tc.akvo.org/public_html/${FOLDER}/ -not -path "*.well-known*" -type f -print0 | xargs -0 -n1 chmod 644"

ssh -i "${SITES_SSH_KEY}" -o BatchMode=yes \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    u7-nnfq7m4dqfyx@35.214.170.100 "find www/tc.akvo.org/public_html/${FOLDER}/ -type d -print0 | xargs -0 -n1 chmod 755"

echo "Copy the config..."

ssh -i "${SITES_SSH_KEY}" -o BatchMode=yes \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    u7-nnfq7m4dqfyx@35.214.170.100 "cp ~/env/${FOLDER}.env.prod www/tc.akvo.org/public_html/${FOLDER}/.env"

echo "Clearing cache..."

ssh -i "${SITES_SSH_KEY}" -o BatchMode=yes \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    u7-nnfq7m4dqfyx@35.214.170.100 "cd www/tc.akvo.org/public_html/${FOLDER}/ && /usr/local/bin/php73 artisan cache:clear"

echo "Done"
