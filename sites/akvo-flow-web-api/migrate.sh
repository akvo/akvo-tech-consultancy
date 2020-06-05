#!/usr/bin/env bash

set -eu

connection="$(python test-connection.py)"

if [[ "${connection}" != "OK" ]]; then
    echo "Unable to connect to PostgreSQL"
    exit 1
fi

flask db upgrade
