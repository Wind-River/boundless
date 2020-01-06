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

Name:     components/EditUser.vue
Purpose:
Methods:
  *

## -->

<template>

  <div class="q-pa-lg">
    <q-layout>
      <!-- -------------------- Header -------------------- -->
      <q-header reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center" >
              <strong>Edit Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <!-- -------------------- Footer -------------------- -->
      <q-footer reveal>
        <q-toolbar>
          <q-toolbar-title>
            <div align="center">
              <strong>Edit Mode</strong>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <!-- -------------------- Loading Spinner -------------------- -->
      <div
        v-if="loading"
        class="absolute-center"
        style="bottom: 15em;"
      >
        <q-spinner color="primary" size="8em" />
      </div>

      <!-- -------------------- Main Content -------------------- -->
      <q-form
        v-else
        @submit="onSubmit"
      >
        <q-splitter
          disable
          v-model="splitterModel"
        >
          <template v-slot:before>
            <q-tabs
              vertical inline-label stretch
              class="text-primary"
              v-model="pageTab"
            >
              <q-tab
                no-caps
                name="main" icon="person_pin" label="Profile"
              />
              <q-separator />
              <q-tab
                no-caps
                name="projects" icon="share" label="Projects"
              />
              <q-separator />
              <q-tab
                no-caps
                name="achievements" icon="brightness_high" label="Achievements"
              />
              <q-separator />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              animated
              transition-prev="jump-up" transition-next="jump-up"
              v-model="pageTab"
            >
              <q-tab-panel name="main">
                <q-card
                  class="q-pa-md"
                  style="min-width: 800px;"
                >
                  <!-- -------------------- Title -------------------- -->
                  <div
                    class="q-mb-sm"
                    align="center"
                  >
                    <strong
                      style="font-size: 18px;"
                    >
                      User Profile
                    </strong>
                    <q-separator color="secondary" />
                  </div>

                  <!-- ---------------- Profile Information ---------------- -->
                  <div class="row q-gutter-md">
                    <!-- ------------------- Main Image -------------------- -->
                    <div
                      class="col-4 cursor-pointer"
                      @click="invokeFilePicker"
                    >
                      <q-img
                        contain
                        :src="mainImage.cur" :ratio="1"
                        class="bg-black"
                        style="border-radius: 3px;"
                      />

                      <q-icon
                        dense flat
                        size="xs" color="accent" name="collections"
                        class="full-width"
                      />

                      <input
                        hidden
                        type="file" ref="imageInput"
                        accept="image/*"
                        @change="filePickerOnChange"
                      />

                      <q-tooltip
                        anchor="bottom middle"
                        self="top middle"
                        :offset="[10, 10]"
                      >
                        Choose your image file...
                      </q-tooltip>
                    </div>

                    <!-- -------------------- Content -------------------- -->
                    <div
                      class="col shadow-2 q-pa-sm"
                      style="border-radius: 3px;"
                    >
                      <!-- ----------------- User Name -------------------- -->
                      <div
                        class="q-pa-md q-mb-sm cursor-pointer"
                        style="border-radius: 3px;"
                      >
                        <strong>
                          Name:
                        </strong>
                        {{ curTocData.name }}
                        <q-popup-edit
                          buttons
                          v-model="curTocData.name"
                          :validate="popUpNameValidation"
                          @hide="popUpReset"
                          @save="reRender"
                        >
                          <q-input
                            dense filled autofocus label="Name"
                            :error="errorObj.error"
                            :error-message="errorObj.message"
                            v-model="curTocData.name"
                          />
                        </q-popup-edit>
                        <dir style="
                          font-style: italic;
                          color: gray;
                          font-size: 14px;"
                        >
                          Member since {{ curTocData.created ? curTocData.created.substring(0, 10) : curTocData.timestamp.substring(0, 10) }}
                        </dir>
                      </div>

                      <!-- ------------------ User Email ------------------- -->
                      <div
                        class="q-pa-md q-mb-sm cursor-pointer"
                        style="border-radius: 3px;"
                      >
                        <strong>
                          Email:
                        </strong>
                        {{ curTocData.email }}
                        <q-popup-edit
                          buttons
                          v-model="curTocData.email"
                          :validate="popUpEmailValidation"
                          @hide="popUpReset"
                          @save="
                            curTocData.email = curTocData.email.toLowerCase();
                            reRender();
                          "
                        >
                          <q-input
                            dense filled autofocus label="Name"
                            :error="errorObj.error"
                            :error-message="errorObj.message"
                            v-model="curTocData.email"
                          />
                        </q-popup-edit>
                      </div>

                      <!-- ------------------ User Title ------------------- -->
                      <div
                        class="q-pa-md q-mb-sm cursor-pointer"
                        style="border-radius: 3px;"
                      >
                        <strong>
                          Title:
                        </strong>
                        {{ curTocData.title }}
                        <q-popup-edit
                          buttons
                          v-model="curTocData.title"
                          @save="reRender"
                        >
                          <q-input
                            dense filled autofocus label="Name"
                            v-model="curTocData.title"
                          />
                        </q-popup-edit>
                      </div>

                      <!-- ------------- Additional Information ------------ -->
                      <div>
                        <div class="row q-px-md">
                          <strong style="fontSize: 20px;">
                            Addtional Information
                          </strong>
                          <q-separator class="q-mx-sm q-mt-md" color="secondary" />
                          <q-btn
                            dense round
                            color="accent" icon="add"
                            class="q-mb-sm"
                            @click="addAdditionalInformation"
                          />
                        </div>

                        <div
                          class="row q-px-md q-mb-md"
                          style="border-radius: 3px;"
                          v-for="(val, key, ind) in curData.socialNetwork"
                          :key="ind"
                        >
                          <div class="col q-ml-sm">
                            <strong>
                              {{ capitalizeKeys(key) }}:
                            </strong>
                            <q-input
                              dense filled
                              v-model="curData.socialNetwork[key]"
                              @blur="reRender"
                            />
                          </div>
                          <div class="col-1" align="right">
                            <q-btn
                              dense round
                              style="top: 1.2em;"
                              color="accent" size="md" icon="delete"
                              @click="deleteAdditionalInformation(key)"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  <!-- {{ curData }} -->
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="projects">
                <div
                  class="shadow-2 q-pa-md"
                  style="
                    margin: auto;
                    max-width: 1000px;
                    min-width: 800px;
                    border-radius: 3px;
                  "
                >
                  <div align="center">
                    <strong>Projects</strong>
                    <hr>
                    <div class="q-pa-md">
                      <div class="q-gutter-md">
                        <!-- <q-select
                          filled use-input hide-selected
                          multiple options-selected-class="text-red"
                          label="Add Menu for Projects"
                          input-debounce="0"
                          :options="projectList.filter"
                          v-model="projectList.projects"
                          @filter="filterFn"
                          @input="updated = true"
                        /> -->
                      </div>
                    </div>
                  </div>
                  <!-- ---------------- ToC Project Content ---------------- -->
                  <!-- <ProjectTable
                    :tableMode="childMode"
                    :popkeywords="keywordsOptions"
                    :projectList="projectList.projects"
                    @deleted="projectDeleteByChild"
                  /> -->
                  <ProjectTable
                    :userId="curTocData.uuid"
                    :childDb="db"
                    :projectList="curData.projects || []"
                    @deleted="projectDeleteByChild"
                  />
                </div>
              </q-tab-panel>

              <q-tab-panel name="achievements">
                <div
                  class="shadow-2 q-pa-md"
                  style="
                    margin: auto;
                    max-width: 1000px;
                    min-width: 800px;
                    border-radius: 3px;
                  "
                >
                  <div align="center">
                    <strong>Achievements</strong>
                    <hr>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>

        <!-- -------------------- Sticky Buttons -------------------- -->
        <q-page-sticky
          position="top-right"
          :offset="[30, 18]"
        >
          <q-btn
            round
            class="q-ml-xs"
            size="sm" icon="done" type="submit"
            :disabled="!updated"
            :color="updated ? 'secondary' : 'accent'"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Submit
            </q-tooltip>
          </q-btn>

          <q-btn
            round
            class="q-ml-xs"
            size="sm" color="accent" icon="clear"
            @click="emitClose"
          >
            <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
              Close
            </q-tooltip>
          </q-btn>
        </q-page-sticky>
      </q-form>
    </q-layout>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'

import ProjectTable from '../components/Tables/ProjectTable'

export default {
  name: 'Edit_User',
  props: {
    userId: String,
    emailList: Array
  },
  components: {
    // uploadGUI
    ProjectTable
  },
  created () {
    this.getDb().then(res => {
      // fetech data from database
      this.getInformation()
      // this.getConfig()
    })
  },
  data () {
    return {
      errorObj: {
        error: false,
        message: ''
      },
      mainImage: {
        prev: '',
        cur: '',
        file: ''
      },
      db: null,
      storage: null,
      loading: true,
      data: {},
      tocData: {},
      curData: {},
      curTocData: {},
      updated: false,
      pageTab: 'main',
      splitterModel: 15
    }
  },
  methods: {
    showtest: function (val) {
      /* console.log(val, 'showtest') */
    },
    test: function (val) {
      /* console.log(val) */
      this.$forceUpdate()
    },
    projectDeleteByChild: function () {
      /* console.log('waka waka') */
    },
    popUpReset: function () {
      this.errorObj.error = false
      this.errorObj.messsage = ''
    },
    popUpNameValidation: function (val) {
      if (val === undefined) {
        this.errorObj.error = false
        this.errorObj.messsage = ''
        return true
      }

      if (!val || val.length === 0) {
        this.errorObj.error = true
        this.errorObj.message = 'Cannot be empty!'
        return false
      }

      // sucessful call
      this.errorObj.error = false
      this.errorObj.messsage = ''
      return true
    },
    popUpEmailValidation: function (val) {
      if (val === undefined) {
        this.errorObj.error = false
        this.errorObj.messsage = ''
        return true
      }

      if (!val || val.length === 0) {
        this.errorObj.error = true
        this.errorObj.message = 'Cannot be empty!'
        return false
      } else if (!this.validateEmailFormat(val)) {
        this.errorObj.error = true
        this.errorObj.message = 'Not a valid email format!'
        return false
      } else if (this.emailList.includes(String(val).toLowerCase())) {
        this.errorObj.error = true
        this.errorObj.message = 'This email is already taken!'
        return false
      }

      // sucessful call
      this.errorObj.error = false
      this.errorObj.messsage = ''
      return true
    },
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    validateEmailFormat: function (entry) {
      let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/
      return re.test(String(entry).toLowerCase())
    },
    reRender: function (entry) {
      this.updated = true
      this.$forceUpdate()
    },
    deleteAdditionalInformation: function (entry) {
      delete this.curData.socialNetwork[entry]
      this.reRender()
    },
    addAdditionalInformation: function () {
      this.$q.dialog({
        title: 'Social Media',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        /* // console.log('>>>> OK, received', data) */
        if (data) {
          this.curData.socialNetwork[data.toLowerCase()] = ''
          this.reRender()
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Cannot be empty!',
            icon: 'warning'
          })
        }
      }).onCancel(() => {
        /* // console.log('>>>> Cancel') */
      }).onDismiss(() => {
        /* // console.log('I am triggered on both OK and Cancel') */
      })
    },
    getMainPhoto: function () {
      let max = 5
      let photoId = Math.floor(Math.random() * (max - 1 + 1)) + 1
      return 'statics/images/project-img-' + photoId + '.jpg'
    },
    invokeFilePicker: function () {
      this.$refs.imageInput.click()
    },
    filePickerOnChange: function (e) {
      const file = e.target.files[0]

      if (file) {
        this.mainImage.cur = URL.createObjectURL(file)
        this.mainImage.file = file
        this.updated = true
      } else {
        this.mainImage.cur = this.mainImage.prev
        this.mainImage.file = ''
        // this.updated = false // removed for persistance
      }
    },
    capitalizeKeys: function (entry) {
      if (entry === 'github') {
        return 'GitHub'
      }
      return entry[0].toUpperCase() + entry.slice(1)
    },
    onSubmit: function () {
      if (this.mainImage.file) {
        this.curTocData.imgURL = `users/${this.curTocData.email}/main/${this.mainImage.file.name}`
        // update the file to storage
        this.storage.ref()
          .child(this.curTocData.imgURL)
          .put(this.mainImage.file)
          .then(res => {
            /* console.log(`Uploaded main image for ${this.curTocData.email}.`) */
            /* // console.log(res) */
          })
      }
      let timeOfSubmit = new Date(Date.now()).toISOString()

      this.curTocData.timestamp = timeOfSubmit
      this.curTocData.imgURL = this.curTocData.imgURL || ''

      if (this.curTocData.updated) {
        this.curTocData.updated = firebase.firestore.FieldValue.delete()
      }

      this.db.collection('users').doc('ToC').set({
        [this.userId]: this.curTocData
      }, { merge: true })

      this.curData.socialNetwork = this.curData.socialNetwork || {}
      this.curData.projects = this.curData.projects || []
      this.curData.achievements = this.curData.achievements || {}

      this.db.collection('users').doc(this.userId).set(this.curData)

      this.emitClose()
      this.$emit('added')
    },
    emitClose: function () {
      this.$emit('close')
    },
    getDb: function () {
      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')
        return new Promise((resolve, reject) => {
          if (sessionDb === 'testing') {
            this.db = testingDb
            this.storage = testingStorage
          } else {
            this.db = productionDb
            this.storage = productionStorage
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
    getInformation: function () {
      this.loading = true
      // this.projectImagePath = this.getMainPhoto()
      let promises = []
      promises.push(this.db.collection('users').doc(this.userId).get())
      promises.push(this.db.collection('users').doc('ToC').get())

      Promise.all(promises)
        .then(res => {
          for (let objField in res[0].data()) {
            // code to fix old user.page
            if (objField === 'github' || objField === 'jive') {
              this.data.socialNetwork = this.data.socialNetwork || {}
              this.data.socialNetwork[objField] = res[0].data()[objField]
            } else {
              this.data[objField] = res[0].data()[objField]
            }
            // optimally, this should be used
            // this.data[objField] = res[0].data()[objField]
          }

          for (let objField in res[1].data()[this.userId]) {
            this.tocData[objField] = res[1].data()[this.userId][objField]
          }

          this.curData = this.deepObjCopy(this.data)
          this.curTocData = this.deepObjCopy(this.tocData)
          this.data = {}
          this.tocData = {}

          // this code is here to fix morph the data to next version
          this.curTocData.uuid = this.curTocData.uuid || this.curTocData.email
          this.curTocData.created = this.curTocData.created || this.curTocData.timestamp
          this.curTocData.title = this.curTocData.title || ''

          if (!this.curTocData.imgURL) {
            this.mainImage.cur = this.getMainPhoto()
            this.mainImage.prev = this.mainImage.cur
          } else {
            // get photo from storage
            this.storage.ref().child(this.curTocData.imgURL).getDownloadURL()
              .then(url => {
                this.mainImage.cur = url
                this.mainImage.prev = url
              })
              .catch(err => {
                if (err) {
                  /* console.log(err) */
                }
                this.mainImage.cur = this.getMainPhoto()
                this.mainImage.prev = this.mainImage.cur
              })
          } // gonna ignore the load time it takes

          setTimeout(() => {
            this.loading = false
          }, 100)
        })
        .catch(error => {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    getConfig: function () {
      this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            let data = doc.data()

            for (let key in data['keywords']) {
              this.keywordsOptions.push({
                label: key,
                value: data['keywords'][key]
              })
            }

            this.allowedDomain = data['allowedDomain']
            this.bodyTypeOptions = data['bodyContentType']
            this.chipTypeOptions = data['chipContentType']
          }
        })
        .catch(function (error) {
          if (error) {
            /* console.log(error) */
          }
        })
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

<style lan="stylus">

</style>
