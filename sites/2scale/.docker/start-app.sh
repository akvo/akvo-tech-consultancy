#! /usr/bin/env sh
set -eu

.docker/setup.sh

# wait-for-it localhost:3306  -- php artisan migrate:fresh --seed
# wait-for-it localhost:3306  -- php artisan migrate:fresh

php-fpm