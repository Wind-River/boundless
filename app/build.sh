#!/bin/bash

rm -rf dist/

cd client

npm i

quasar build && sleep 2 && mv dist/ ../
