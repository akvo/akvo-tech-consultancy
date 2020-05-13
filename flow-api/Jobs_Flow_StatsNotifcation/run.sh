#!/bin/bash

echo $TOKEN_PICKLE | base64 -d > token.pickle
python app.py --limit
