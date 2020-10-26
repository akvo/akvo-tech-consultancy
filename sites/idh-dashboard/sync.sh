#!/usr/bin/env bash

FOLDER="idh-dashboard"

rsync \
    --archive \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
    . siteground:/home/customer/www/tc.akvo.org/public_html/$FOLDER/

echo "Fixing permissions..."

ssh siteground "find www/tc.akvo.org/public_html/${FOLDER}/ -not -path "*.well-known*" -type f -print0 | xargs -0 -n1 chmod 644"

ssh siteground "find www/tc.akvo.org/public_html/${FOLDER}/ -type d -print0 | xargs -0 -n1 chmod 755"

ssh siteground "cp ~/env/${FOLDER}.env.prod www/tc.akvo.org/public_html/${FOLDER}/.env"

echo "Done"
