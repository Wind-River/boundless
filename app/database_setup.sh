#!/bin/bash

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
