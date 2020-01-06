#!/bin/bash

if [ -r .firebaserc ]; then
  content=$(cat .firebaserc)
elif [ -f .firebaserc ]; then
  echo "The file '.firebaserc' exists but is not readable to the script."
  exit 1
else
  echo ERROR: Failed since .firebaserc file does not exists...
  exit 1
fi

firebase_default=`node -pe 'JSON.parse(process.argv[1]).projects.default' "$content"`
firebase_production=`node -pe 'JSON.parse(process.argv[1]).projects.production' "$content"`
firebase_testing=`node -pe 'JSON.parse(process.argv[1]).projects.foo' "$content"`

if [ "$firebase_default" == "undefined" ]; then
  echo ERROR: Default project does not exists...
  exit 1
fi
firebase use default
firebase deploy --only functions

if [ "$firebase_production" != "undefined" ]; then
  firebase use production
  firebase deploy --only functions
fi

if [ "$firebase_testing" != "undefined" ]; then
  firebase use testing
  firebase deploy --only functions
fi

firebase use default

exit 0
