#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [ -z "$TRAVIS_COMMIT" ]; then
    export TRAVIS_COMMIT=local
fi

log Creating Production image

docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/tc-export-csv-mali:${TRAVIS_COMMIT} .
docker tag eu.gcr.io/${PROJECT_NAME}/tc-export-csv-mali:${TRAVIS_COMMIT} eu.gcr.io/${PROJECT_NAME}/tc-export-csv-mali:develop

log Done