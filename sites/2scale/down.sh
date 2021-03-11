#! /usr/bin/env sh
set -eu

echo "Stopping container and delete all data"
docker-compose down -v