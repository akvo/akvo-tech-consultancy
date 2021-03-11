#! /usr/bin/env sh
set -eu

echo "Starting container"
docker-compose up -d

echo "Waiting container to start for 30 seconds"
sleep 30

echo "Importing data"
sh .docker/import-db.sh