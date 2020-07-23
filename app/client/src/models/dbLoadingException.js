
/* ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     models/dbLoadingException.js
Purpose:  Exception related to Firebase.

Methods: Inherits from Error and can be detected using 'instanceof'.

## */

export default class DbLoadingException extends Error {
  constructor (...params) {
    super(...params)
    this.name = 'Database Loading Exception'
  }
}