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

Purpose: To build the spa folder and copy the folder back to root
'

rm -rf dist/

cd client

npm i

quasar build && sleep 2 && mv dist/ ../

echo "Please serve 'dist/spa' file on a static filesever..."
