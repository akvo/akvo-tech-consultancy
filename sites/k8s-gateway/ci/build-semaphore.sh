#!/usr/bin/env bash
set -eu

function log {
   echo "$(date +"%T") - INFO - $*"
}

export PROJECT_NAME=akvo-lumen

if [[ "${TRAVIS_PULL_REQUEST}" != "true" ]]; then
    log "Not a pull request, ignoring build"
    exit 0
fi

log Authentication with gcloud and kubectl
gcloud auth activate-service-account --key-file "${GCLOUD_ACCOUNT_FILE}"
gcloud config set project akvo-lumen
gcloud config set container/cluster europe-west1-d
gcloud config set compute/zone europe-west1-d
gcloud config set container/use_client_certificate True

log Environement is test
gcloud container clusters get-credentials test

log Check the K8s deployment
kubectl apply --dry-run=client -f ci/k8s/tech-consultancy-gateway.yaml
