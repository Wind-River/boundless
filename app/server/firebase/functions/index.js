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

// For Deployment
admin.initializeApp()

const storage = admin.storage().bucket()

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

    throw new functions.https.HttpsError('400', err)
  }
})
