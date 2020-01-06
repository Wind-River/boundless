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

Name:     components/Upload.vue
Purpose:
Methods:
  *

## -->

<template>
  <q-card
    class="q-pa-md q-ml-sm q-mr-sm"
  >
    <q-form
      @submit="onSubmit"
    >
      <div
        class="q-mb-sm"
      >
        <q-uploader
          ref="file"
          class="full-width"
          label="Choose file to upload to Firebase.Storage()"
          bordered
          hide-upload-btn
          no-thumbnails
          multiple
          :disable="uploading"
          @added="onAdd"
          @removed="onRemove"
        />
      </div>

      <div
        class="shadow-2 q-pa-sm"
        style="border-radius: 3px;"
      >
        <strong>Path Alias:</strong>
        <q-separator color="secondary" />

        <div
          class="q-mt-sm q-pa-xs cursor-pointer"
          v-for="(val, k, ind) in curData"
          :key="ind"
          style="
            border: solid 1px;
            border-radius: 3px;
          "
        >
          <strong>{{ k }}:</strong> {{ curData[k].key }}
          <q-popup-edit
            buttons
            v-model="curData[k].key"
          >
            <q-input
              dense
              filled
              autofocus
              :label="k"
              v-model="curData[k].key"
            />
          </q-popup-edit>
        </div>
      </div>

      <div
        class="q-mt-sm"
        align="center"
      >
        <q-btn
          class="full-width"
          color="secondary"
          label="Upload"
          no-caps
          :disable="!attachedFile"
          type="submit"
        />
        <q-tooltip v-if="!attachedFile">
          Please attach file or files.
        </q-tooltip>
      </div>

      <q-inner-loading :showing="uploading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-form>
  </q-card>
</template>

<script>
import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'

export default {
  name: 'Storage_Upload',
  props: {
    uid: String
  },
  created () {
    // will never be here without boudless_db being selected
    if (this.$q.localStorage.has('boundless_db')) {
      let sessionDb = this.$q.localStorage.getItem('boundless_db')

      if (sessionDb === 'testing') {
        this.db = testingDb
        this.storage = testingStorage
      } else {
        this.db = productionDb
        this.storage = productionStorage
      }
    }
  },
  data () {
    return {
      db: null,
      storage: null,
      attachedFile: false,
      uploading: false,
      data: {},
      curData: {}
    }
  },
  methods: {
    onSubmit: function () {
      this.uploading = true

      let webFiles = {}

      for (let file in this.curData) {
        webFiles[this.curData[file].key] = this.curData[file].val
      }

      this.db.collection('projects').doc(this.uid).set({
        files: webFiles
      }, { merge: true })
      this.uploadToStorage()
    },
    onAdd: function () {
      this.attachedFile = true

      if (Object.keys(this.curData).length === 0) {
        for (let i = 0; i < this.$refs.file.files.length; i++) {
          let file = this.$refs.file.files[i]

          this.data[file.name] = {
            key: file.name,
            val: `${this.uid}/files/${file.name}`
          }
        }

        this.curData = this.deepObjCopy(this.data)
        this.data = {} // to save memory
      } else {
        for (let i = 0; i < this.$refs.file.files.length; i++) {
          let file = this.$refs.file.files[i]

          // if the file does not exists in curData
          if (!(file.name in this.curData)) {
            this.data[file.name] = {
              key: file.name,
              val: `${this.uid}/files/${file.name}`
            }
          }
        }

        let tmpDeepClone = this.deepObjCopy(this.data)
        this.data = {} // to save memory

        for (let fileName in tmpDeepClone) {
          this.curData[fileName] = tmpDeepClone[fileName]
        }
      }

      this.$forceUpdate()
    },
    onRemove: function (fileArray) {
      if (this.$refs.file.files.length === 0) {
        this.attachedFile = false
      } else {
        this.attachedFile = true
      }

      // delete this.data[fileArray[0].name]
      delete this.curData[fileArray[0].name]

      this.$forceUpdate()
    },
    uploadToStorage: function () {
      let file = this.$refs.file.files[0]

      this.storage.ref().child(`projects/${this.uid}/files/${file.name}`).put(file)
        .then(res => {
          this.$refs.file.files.splice(0, 1)
        })
        .then(res => {
          if (this.$refs.file.files.length === 0) {
            this.attachedFile = false
            this.showLoading()

            this.$emit('close', this.curData)
          } else {
            this.uploadToStorage()
          }
        })
    },
    showLoading: function () {
      setTimeout(() => {
        this.uploading = false
      }, 500)
    },
    deepObjCopy: function (aObject) {
      // https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript/34624648#34624648
      if (!aObject) {
        return aObject
      }

      let v
      let bObject = Array.isArray(aObject) ? [] : {}
      for (const k in aObject) {
        v = aObject[k]
        bObject[k] = (typeof v === 'object') ? this.deepObjCopy(v) : v
      }

      return bObject
    }
  }
}
</script>

<style lang="stylus">

</style>
