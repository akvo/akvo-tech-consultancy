#!/bin/bash

set -ev

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    COMMIT_RANGE="FETCH_HEAD..$TRAVIS_BRANCH"
    echo "travis PR #$TRAVIS_PULL_REQUEST build, looking at files in $COMMIT_RANGE"
    COMMIT_CONTENT=`git diff --name-only $COMMIT_RANGE` || {
      echo "travis PR range diff failed, probably on maintenance branch, falling back to full tests"
      COMMIT_CONTENT="FULL TEST PLEASE!"
    }
    echo "PR content: $COMMIT_CONTENT"
else
    COMMIT_RANGE=${TRAVIS_COMMIT_RANGE/.../..}
    echo "travis push build, looking at files in $COMMIT_RANGE"
    if [ "$COMMIT_RANGE" == "" ]; then
      echo "travis commit range empty, probably first push to a new branch"
      COMMIT_CONTENT=`git diff-tree --no-commit-id --name-only -r $TRAVIS_COMMIT`
    else
      COMMIT_CONTENT=`git diff --name-only $COMMIT_RANGE` || {
        echo "travis commit range diff failed, probably new PR or force push, falling back to single commit $TRAVIS_COMMIT"
        COMMIT_CONTENT=`git diff-tree --no-commit-id --name-only -r $TRAVIS_COMMIT`
      }
    fi
    echo "commits content: $COMMIT_CONTENT"
fi
