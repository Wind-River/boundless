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
# Purpose: To build the spa folder and copy the folder back to root
################################################################################

rm -rf ../dist/

cd client

# always better to inspect node_modules
npm i

sleep 2
echo ""
echo ""
echo "BUILDING BOUNDLESS..."
echo ""
sleep 1

npx quasar build && sleep 2 && mv dist/ ../../

echo "Please serve 'dist/spa' file on a static filesever..."
echo "The software can also be run locally via 'quasar dev' inside 'app/client' directory or the by calling 'make run' from root."

sleep 1
