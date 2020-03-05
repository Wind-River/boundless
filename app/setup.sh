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

Purpose: To instruct CLI related installation processes to the user
'

if [ -r config/system.yml ]; then
  echo "The required file is already generated..."
  echo "Please make sure all the firebase credentials are ported to 'system.yml' file..."
  echo "Please proceed with ./database_setup.sh..."
  exit 1
elif [ -f config/system.yml ]; then
  echo "The file 'system.yml' exists but is not readable to the script!"
  exit 1
else
  echo "The required file is being generated."
  echo "Please wait a moment..."
  cp config/system.template config/system.yml
  sleep 3
  echo "Please go into 'config' folder and edit 'system.yml' with your firebase credentials."
  echo "Once you have edit the 'system.yml' file with your firebase credentials, you may execute 'database_setup.sh' by calling './database_setup.sh' inside the root."
  sleep 1
  exit 0
fi
