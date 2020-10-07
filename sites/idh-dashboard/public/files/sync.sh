#!/usr/bin/env bash

set -eu

FOLDER="idh-dashboard"

rsync \
    --archive \
    --compress \
    --progress \
    --exclude=ci \
    --exclude=node_modules \
    . siteground:/home/customer/www/tc.akvo.org/public_html/$FOLDER/public/files
