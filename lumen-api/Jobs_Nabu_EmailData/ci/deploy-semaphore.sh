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

log Authentication with gcloud and kubectl
gcloud auth activate-service-account --key-file=/home/semaphore/.secrets/gcp.json
gcloud config set project akvo-lumen
gcloud config set container/cluster europe-west1-d
gcloud config set compute/zone europe-west1-d
gcloud config set container/use_client_certificate False

## TODO!!! Change to prod! Decide if we publish to test or not
if [[ "${TRAVIS_BRANCH}" == "master" ]]; then
    log Environment is production
    log Project not deployed to production cluster. Exiting now.
    exit 0
else
    log Environement is test
    gcloud container clusters get-credentials test
fi

log Pushing images
gcloud auth configure-docker
docker push "eu.gcr.io/${PROJECT_NAME}/tech-consultancy-nabu-emaildata-notification:${TRAVIS_COMMIT}"

sed -e "s/\${TRAVIS_COMMIT}/$TRAVIS_COMMIT/" ci/k8s/deployment.yaml > deployment.yaml.donotcommit

kubectl apply -f deployment.yaml.donotcommit
