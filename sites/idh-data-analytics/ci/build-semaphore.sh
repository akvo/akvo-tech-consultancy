#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [[ "${TRAVIS_BRANCH}" != "master" && "${TRAVIS_BRANCH}" != "develop" ]]; then
    exit 0
fi

if [ -z "$TRAVIS_COMMIT" ]; then
    export TRAVIS_COMMIT=local
fi

log Creating Production image

docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/tech-consultancy-idh-data-analytics:${TRAVIS_COMMIT} .

log Done
set -eu