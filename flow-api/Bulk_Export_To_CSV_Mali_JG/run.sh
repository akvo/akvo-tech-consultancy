#!/usr/bin/env sh

set -eu

echo "Starting"
#python3 FlowApi.py akvoflowsandbox survey 25793011

date >> upload.txt

echo "Done"

gcloud auth activate-service-account --key-file=/var/run/secret/cloud.google.com/service-account.json
gcloud config set project akvo-lumen

gsutil cp upload.txt gs://tech-consultancy/mali

if [ $RANDOM -le 4000 ]; then
    exit 0;
else
    exit 0
fi