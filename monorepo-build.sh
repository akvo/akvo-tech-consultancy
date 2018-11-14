#!/bin/bash

set -eu

if [[ "${TRAVIS_PULL_REQUEST:=false}" != "false" ]]; then
    COMMIT_RANGE="FETCH_HEAD..${TRAVIS_BRANCH}"
    echo "travis PR #${TRAVIS_PULL_REQUEST} build, looking at files in ${COMMIT_RANGE}"
    COMMIT_CONTENT=$(git diff --name-only "${COMMIT_RANGE}")
else
    COMMIT_RANGE="${TRAVIS_COMMIT_RANGE/.../..}"
    echo "travis push build, looking at files in ${COMMIT_RANGE}"
    if [ "${COMMIT_RANGE}" == "" ]; then
      echo "travis commit range empty, probably first push to a new branch"
      COMMIT_CONTENT=$(git diff-tree --no-commit-id --name-only -r "${TRAVIS_COMMIT}")
    else
      COMMIT_CONTENT=$(git diff --name-only "${COMMIT_RANGE}") || {
        echo "travis commit range diff failed, probably new PR or force push, falling back to single commit ${TRAVIS_COMMIT}"
        COMMIT_CONTENT=$(git diff-tree --no-commit-id --name-only -r "${TRAVIS_COMMIT}")
      }
    fi
fi

echo "commits content: ${COMMIT_CONTENT}"

# Directories two level deep
DIRS=$(echo "${COMMIT_CONTENT}" | grep ".*/.*/.*" | cut -f -2 -d/ | sort -u)

while read -r line; do
    if [[ -f "${line}/ci/build.sh" ]]; then
        echo "Building ${line}"
        pushd "${line}"
        ./ci/build.sh
        if [[ -f "ci/deploy.sh" ]]; then
            echo "Deploying ${line}"
            ./ci/deploy.sh
        fi
        popd
    fi
done <<< "${DIRS}"
