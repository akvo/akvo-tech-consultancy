#! /usr/bin/env sh
set -eu

./docker/setup.sh

wait-for-it appdb:3306  -- php artisan migrate

php-fpm
