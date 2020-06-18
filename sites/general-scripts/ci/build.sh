#!/usr/bin/env bash

set -eu

cat analytics.js | sed s/#pos#/left/g > analytics-left.js
cat analytics.js | sed s/#pos#/right/g > analytics-right.js
