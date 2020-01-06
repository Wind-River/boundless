/*<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.
## -->*/

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// const db = admin.firestore()
const storage = admin.storage().bucket()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   console.log('Hello from vue')
//   response.send("Hello from Firebase!");
// });

exports.appCall = functions.https.onCall(async (data, context) => {
  // https://stackoverflow.com/a/54961702
  try {
    let files = await storage.getFiles()

    let dirFiles = files[0].filter(f => f.name.includes(data.folder))

    dirFiles.forEach(async file => {
      await file.delete()
    })

    return {
      data: `Folder ${data.folder} is removed!`
    }
  } catch (err) {
    console.log(err)
  }

  return {
    data: 'Error!'
  }
})

exports.appTestPoint = functions.https.onCall((data, context) => {
  console.log('starting the appTestPoint')
  for (let prop in context.rawRequest) {
    console.log(prop)
  }

  return {
    data: data.data
  }
})
