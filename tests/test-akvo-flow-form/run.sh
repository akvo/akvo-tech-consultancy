#!/usr/bin/env bash

set -euo pipefail

for n in form cascade
do
    cd ./${n} && pytest -o log_cli=true
    cd -
done
