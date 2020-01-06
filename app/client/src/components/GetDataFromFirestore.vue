<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.

Name:     components/GetDataFromFirestore.vue
Purpose:
Methods:
  *

## -->

<template>
  <div class="q-pa-sm full-width">
    <q-card class="q-pa-md dbCard">

      <q-uploader
        bordered hide-upload-btn
        class="full-width q-mb-sm"
        label="Upload JSON file for 'Import'..."
        ref="file"
        accept=".json"
        @added="retrieveDataFromFile"
        @removed="attachedFile = !attachedFile"
      />

      <q-form @submit="onSubmit">
        <div class="row q-gutter-sm" align="center">
          <div class="col">
            <q-btn
              class="full-width"
              type="submit"
              label="Import"
              no-caps
              :disable="!attachedFile"
            />
            <q-tooltip v-if="!attachedFile">
              Please attach a '*.json' file.
            </q-tooltip>
          </div>

          <q-btn
            class="col"
            color="secondary"
            @click="download('boundless_data', data)"
            label="Download"
            no-caps
          />
        </div>
      </q-form>

    </q-card>
  </div>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import { dbMeta } from '../../boundless.config'

export default {
  name: 'Export_Data',
  created () {
    this.getDb().then(() => {
      this.getData()
    })
  },
  data () {
    return {
      db: null,
      loading: false,
      attachedFile: false,
      meta: [],
      data: [],
      importDataField: ''
    }
  },
  methods: {
    getDb: function () {
      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')
        return new Promise((resolve, reject) => {
          if (sessionDb === 'testing') {
            this.db = testingDb
          } else {
            this.db = productionDb
          }
          resolve('Database fetch complete...')
        })
      } else {
        return new Promise((resolve, reject) => {
          productionDb.collection('config').doc('project').get()
            .then(doc => {
              if (doc.exists) {
                if (doc.data().db === 'testing') {
                  this.db = testingDb
                  this.$q.localStorage.set('boundless_db', 'testing')
                } else {
                  this.db = productionDb
                  this.$q.localStorage.set('boundless_db', 'production')
                }
                resolve('Database fetch complete...')
              } else {
                reject('"/config/project" path does not exists in the database...')
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      }
    },
    onSubmit: function () {
      this.$emit('importingToDB', true)
      this.db.collection('--db_meta--').doc('data').set(this.meta)

      this.importDataField.forEach(colObj => {
        let dbCollection = this.db.collection(colObj.name)
        colObj.data.forEach(colData => {
          dbCollection.doc(colData.doc_id).set(colData.data)
            .then(() => {
              if ((colObj.name === this.importDataField[this.importDataField.length - 1].name) && (colData.doc_id === this.importDataField[this.importDataField.length - 1].data[this.importDataField[this.importDataField.length - 1].data.length - 1].doc_id)) {
                // console.log(this.importDataField[this.importDataField.length - 1].name, this.importDataField[this.importDataField.length - 1].data[this.importDataField[this.importDataField.length - 1].data.length - 1].doc_id)
                setTimeout(() => {
                  this.$refs.file.files.splice(0, 1)
                  this.attachedFile = false
                  this.$emit('importingToDB', false)
                }, 500)
              }
            })
        })
      })
    },
    download: function (filename, text) {
      // https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
      let todayDate = new Date(Date.now()).toISOString().substring(0, 19)
      let element = document.createElement('a')

      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(text, null, 2)))

      element.setAttribute('download', `${filename}.${todayDate}.json`)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    getData: function () {
      this.db.collection('--db_meta--').doc('data').get()
        .then(doc => {
          if (doc.exists) {
            this.meta = doc.data()

            // copy each fields from file to db
            this.meta.collections.forEach(colId => {
              this.db.collection(colId).get()
                .then(docs => {
                  let collectionDocuments = []

                  docs.forEach(doc => {
                    collectionDocuments.push({
                      doc_id: doc.id,
                      data: doc.data()
                    })
                  })

                  this.data.push({
                    name: colId,
                    data: collectionDocuments
                  })
                })
            })
          } else {
            this.meta = dbMeta

            // write the meta collection to db
            this.db.collection('--db_meta--').doc('data').set(this.meta)

            // copy each fields from file to db
            this.meta.collections.forEach(colId => {
              this.db.collection(colId).get()
                .then(docs => {
                  let collectionDocuments = []

                  docs.forEach(doc => {
                    collectionDocuments.push({
                      doc_id: doc.id,
                      data: doc.data()
                    })
                  })

                  this.data.push({
                    name: colId,
                    data: collectionDocuments
                  })
                })
            })
          }
        })
        .catch(err => {
          if (err) {
            /* console.log(err) */
          }
        })
    },
    retrieveDataFromFile: function () {
      let fr = new FileReader()
      fr.readAsText(this.$refs.file.files[0])
      fr.onload = () => {
        this.importDataField = JSON.parse(fr.result)

        this.attachedFile = !this.attachedFile
      }
    }
  }
}
</script>

<style>

</style>
