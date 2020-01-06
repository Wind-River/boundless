#!/bin/bash

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
