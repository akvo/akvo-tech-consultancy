#!/usr/bin/env bash

set -eu

if [[ "${TRAVIS_BRANCH}" != "develop" ]] && [[ "${TRAVIS_BRANCH}" != "master" ]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

echo "Deploying analytics..."

scp -i ${SITES_SSH_KEY} -P 18765 analytics-left.js tcakvo@109.73.232.40:/home/tcakvo/public_html/
scp -i ${SITES_SSH_KEY} -P 18765 analytics-right.js tcakvo@109.73.232.40:/home/tcakvo/public_html/
