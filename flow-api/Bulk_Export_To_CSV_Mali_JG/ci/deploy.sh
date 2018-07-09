#!/usr/bin/env bash

set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [[ "${TRAVIS_BRANCH}" != "develop" ]] && [[ "${TRAVIS_BRANCH}" != "master" ]]; then
    exit 0
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
    exit 0
fi

log Making sure gcloud and kubectl are installed and up to date
gcloud components install kubectl
gcloud components update
gcloud version
which gcloud kubectl

log Authentication with gcloud and kubectl
gcloud auth activate-service-account --key-file "${GCLOUD_ACCOUNT_FILE}"
gcloud config set project akvo-lumen
gcloud config set container/cluster europe-west1-d
gcloud config set compute/zone europe-west1-d
gcloud config set container/use_client_certificate True

## TODO!!! Change to prod! Decide if we publish to test or not
if [[ "${TRAVIS_BRANCH}" == "master" ]]; then
    log Environment is production
    gcloud container clusters get-credentials test
else
    log Environement is test
    gcloud container clusters get-credentials test
fi

log Pushing images
gcloud docker -- push eu.gcr.io/${PROJECT_NAME}/tech-consultancy-export-csv-mali

sed -e "s/\${TRAVIS_COMMIT}/$TRAVIS_COMMIT/" ci/k8s/cronjob.yaml.template > cronjob.mali.yaml.donotcommit

kubectl apply -f cronjob.mali.yaml.donotcommit
