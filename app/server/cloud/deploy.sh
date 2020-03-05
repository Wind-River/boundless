#!/bin/bash
'
Copyright (c) 2019 Wind River Systems, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at:
      http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software  distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
OR CONDITIONS OF ANY KIND, either express or implied.

Purpose: To automatically deploy Firebase Cloud Functions to all the projects
         associated with Boundless Innovation
'

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
