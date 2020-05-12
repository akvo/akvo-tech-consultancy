#!/usr/bin/env bash

set -eu
echo $TOKEN_PICKLE | base64 -d > token.pickle
python app.py --limit
