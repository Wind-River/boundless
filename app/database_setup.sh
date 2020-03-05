#!/bin/bash

################################################################################
# Copyright (c) 2019 Wind River Systems, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at:
#       http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software  distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
# OR CONDITIONS OF ANY KIND, either express or implied.
#
# Purpose: To generate database.cred.js for the software and
#          and copy the generated file into the correct repo
################################################################################

if [ -r config/system.yml ]; then
  node config/setup.js
  sleep 2
  echo "The file is being moved into the client directory..."
  cp config/system.js client/database.cred.js
  sleep 2
  echo "The software is now ready to run either by executing './demo.sh' or by executing 'quasar dev' inside client folder..."
  sleep 1
  exit 0
elif [ -f config/system.js ]; then
  echo "The file 'system.js' exists but is not readable to the script."
  exit 1
else
  echo "ERROR: Failed since 'system.js' file does not exists within the 'config' folder..."
  echo "In order to create the required file 'system.yml', please execute './setup.sh' in the root..."
  sleep 3
  exit 1
fi
