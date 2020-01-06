#!/bin/bash

rm -rf dist/

cd client

quasar build && sleep 2 && mv dist/ ../
