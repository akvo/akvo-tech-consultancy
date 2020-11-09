#!/usr/bin/env bash

set -euo pipefail

for n in form cascade
do
    echo ""
    echo "** Running test in folder ${n}"
    echo ""
    cd ./${n} && pytest -o log_cli=true
    cd -
done

python app.py
