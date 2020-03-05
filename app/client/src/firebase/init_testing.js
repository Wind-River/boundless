/* ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     firebase/init_testing.js
Purpose:  To provide testing firebase credentials for firebase services

## */

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

import { firebaseConfigs } from '../../boundless.config'

// Your web app's Firebase configuration
let firebaseConfig = firebaseConfigs.testing

// Initialize Firebase
const firebaseAppTesting = firebase.initializeApp(firebaseConfig, 'secondary')

// export const testingAuth = firebaseAppTesting.auth()
export const testingStorage = firebaseAppTesting.storage()

// Initializing Firebase Cloud Functions for testingDb
export const testAppCall = firebaseAppTesting.functions()

// Export firebase to be used in other parts of the application
export default firebaseAppTesting.firestore()
