#! /usr/bin/env sh
set -eu

composer install

cp .env.example .env
