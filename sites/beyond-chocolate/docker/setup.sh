#! /usr/bin/env sh
set -eu

composer install

if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi
