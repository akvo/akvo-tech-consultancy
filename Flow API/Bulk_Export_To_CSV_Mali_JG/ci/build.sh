#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

export PROJECT_NAME=akvo-tech-consultancy

if [ -z "$TRAVIS_COMMIT" ]; then
    export TRAVIS_COMMIT=local
fi

cd "Flow API/Bulk_Export_To_CSV_Mali_JG"

log Creating Production image

docker build --rm=false -t eu.gcr.io/${PROJECT_NAME}/tech-consultancy-export-csv-mali:${TRAVIS_COMMIT} .

log Done