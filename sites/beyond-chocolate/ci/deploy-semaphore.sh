#!/usr/bin/env bash

set -eu

rsync --version

# Change owner as docker generated files
# are usually owned by root
sudo chown "${USER}:" . -R

echo "Deploying site..."

if [["${TRAVIS_BRANCH}" != "sites/beyond-chocolate" && "${TRAVIS_BRANCH}" != "sites/beyond-chocolate-test"]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

FOLDER="gisco-demo"
if [[ "${TRAVIS_BRANCH}" == "sites/beyond-chocolate" ]]; then
	FOLDER="gisco-pilot"
	echo "Deploying Production"
fi

echo "===================================================="
echo "START SYNC ${FOLDER}"
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

echo "Migrating database - ${FOLDER}"

ssh -i "${SITES_SSH_KEY}" -o BatchMode=yes \
    -p 18765 \
    -o UserKnownHostsFile=/dev/null \
    -o StrictHostKeyChecking=no \
    u7-nnfq7m4dqfyx@35.214.170.100 "cd www/tc.akvo.org/public_html/${FOLDER}/ && /usr/local/bin/php73 artisan migrate --force --no-interaction"

echo "===================================================="
echo "Done deploying ${FOLDER}"
