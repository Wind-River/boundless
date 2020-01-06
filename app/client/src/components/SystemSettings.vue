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

Name:     components/SystemSettings.vue
Purpose:
Methods:
  *

## -->

<template>
  <div class="q-pa-sm full-width">
    <q-card class="q-pa-md">
      <hr>
      <div
        v-for="(val, field, index) in data"
        :key="index"
      >
        <!-- TODO: REMOVE THIS ONCE EXTRAKEYWORDSDATA IS REMOVED -->
        <div v-if="field !== 'extraKeywordsData'">
          <div class="row">

            <div class="text-h6 col-2">{{ fieldParser(field) }}:</div>

            <div
              class="col-2 q-gutter-sm"
              align="left"
            >
              <div v-if="field === 'keywords'">
                <q-btn
                  dense round
                  color="accent" size="md" icon="add" style="margin: 0;"
                  @click="addKeywords"
                />
              </div>

              <div v-else-if="field === 'customChips'">
                <q-btn
                  dense round
                  color="accent" size="md" icon="add" style="margin: 0;"
                  @click="addCustomChips"
                />
              </div>
            </div>

            <div
              v-if="Array.isArray(val)"
              class="col"
            >
              <div v-if="field === 'customChips'">
                <q-chip
                  v-for="(arrVal, arrInd) in val" :key="arrInd"
                  color="secondary" text-color="white"
                  :icon="arrVal.value" :label='arrVal.label'
                  removable
                  @remove="deleteCustomChips(arrInd)"
                />
              </div>

              <div v-else>
                <div v-if="val.length === 0">
                  {{ val }}
                  <!-- <q-popup-edit v-model="data[field]" title="Edit the Name">
                    <q-input dense autofocus v-model="data[field]" />
                  </q-popup-edit> -->
                </div>

                <div
                  v-else
                  v-for="(arrVal, arrInd) in val"
                  :key="arrInd"
                >
                  {{ arrVal }}
                  <!-- <q-popup-edit v-model="data[field]" title="Edit the Name">
                    <q-input dense autofocus v-model="data[field]" />
                  </q-popup-edit> -->
                </div>
              </div>
            </div>

            <div
              v-else-if="typeof val === 'object'"
              class="col"
            >
              <div>
                <div v-if="Object.keys(val).length === 0" class="q-py-sm">
                  Nothing here!
                </div>

                <div
                  v-else
                  class="row q-py-sm"
                  v-for="(val, key, keyInd) in val"
                  :key="keyInd"
                >
                  <div class="col">
                    {{ key }}
                  </div>

                  <div class="col-7 row">
                    <img
                      class="cursor-pointer"
                      :ref="`img${key}`"
                      :src="data.extraKeywordsData[key] || '../statics/images/other-icon.png'"
                      style="height: 40px; max-width: 45px"
                      @click="invokeFilePicker(`input${key}`)"
                    >
                    <input
                      hidden
                      type="file" accept="image/*"
                      :ref="`input${key}`"
                      @change="filePickerOnChange(`img${key}`, key)"
                    />
                    <q-space />
                    <q-btn
                      dense round flat
                      icon="delete" color="accent"
                      @click="keywordsDelete(key)"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div
              v-else-if="field === 'enabledChallenges'"
              class="col"
            >
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <!-- <q-item-label>Battery too low</q-item-label> -->
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle
                    color="green"
                    v-model="data.enabledChallenges"
                    @input="invokeChallengesEnabler"
                  />
                </q-item-section>
              </q-item>
            </div>

            <div v-else class="cursor-pointer col q-mt-sm" >
              <b>{{ val }}</b>
              <q-popup-edit
                title="Edit the Name"
                v-model="data[field]"
              >
                <q-input
                  dense autofocus filled
                  v-model="data[field]"
                />
              </q-popup-edit>
            </div>
          </div>
          <hr>
        </div>
      </div>

      <div class="q-pa-md q-gutter-sm" align="center">
        <q-btn
          no-caps
          color="secondary" label="Submit"
          @click="onSubmit"
        />

        <q-btn
          v-if="$q.sessionStorage.has('admin_token')"
          flat no-caps
          label="Change Admin Password"
          @click="invokeAdminPassChange"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'

import sha256 from 'sha256'

export default {
  name: 'Firebase_Config',
  created () {
    this.getDb().then(res => {
      this.getInformation()
    })
  },
  beforeUpdate () {
  },
  updated () {
  },
  data () {
    return {
      db: null,
      storage: null,
      fileDeleteQueue: [],
      data: {}
    }
  },
  methods: {
    invokeChallengesEnabler: function () {
      this.$forceUpdate()
    },
    addCustomChips: function () {
      // adding custChips
      let tmpChip = {}

      this.$q.dialog({
        title: 'Add new chip',
        message: 'What would the label be?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          tmpChip.label = data

          this.$q.dialog({
            title: 'Add new chip',
            message: 'What would the icon be?<br />Need the icon code from following sites: <ul><li><a href="https://material.io/resources/icons/?style=baseline" target="_blank">material</a></li><li><a href="https://fontawesome.com/" target="_blank">fontawesome</a></li></ul><br /> ie: "3d_rotation", "alarm_on", or "fab fa-google"',
            html: true,
            prompt: {
              model: '',
              type: 'text' // optional
            },
            cancel: true,
            persistent: true
          }).onOk(data => {
            if (data) {
              tmpChip.value = data

              this.data.customChips.push(tmpChip)
            } else {
            }
          }).onCancel(() => {
          }).onDismiss(() => {
          })
        } else {
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    deleteCustomChips: function (index) {
      // confirm with dialog
      this.data.customChips.splice(index, 1)
    },
    invokeAdminPassChange: function () {
      let tmpObj = {}

      this.$q.dialog({
        title: 'Admin Password Change',
        message: 'Old Password:',
        prompt: {
          model: '',
          type: 'password'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        tmpObj.old_pw = data

        this.$q.dialog({
          title: 'Admin Password Change',
          message: 'New Password:',
          prompt: {
            model: '',
            type: 'password'
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          tmpObj.new_pw = data

          this.$q.dialog({
            title: 'Admin Password Change',
            message: 'Confirm New Password:',
            prompt: {
              model: '',
              type: 'password'
            },
            cancel: true,
            persistent: true
          }).onOk(data => {
            tmpObj.conf_pw = data

            if (tmpObj.new_pw === tmpObj.old_pw) {
              this.$q.dialog({
                title: 'Error!',
                message: 'New password cannot be the same as old password.'
              })
            } else if (tmpObj.new_pw !== tmpObj.conf_pw) {
              this.$q.dialog({
                title: 'Error!',
                message: 'New password does not match the confirmation password.'
              })
            } else {
              this.$emit('submitting', true)

              this.db.collection('--db_meta--').doc('data').get()
                .then(doc => {
                  if (doc.exists) { // if doc is there
                    let docData = doc.data()
                    let shaOldPass = sha256(tmpObj.old_pw)
                    let shaNewPass = sha256(tmpObj.new_pw)

                    let correctPass = shaOldPass === docData.admin.password

                    if (correctPass) { // if the old_pw is same as real
                      let newMetaAdmin = {
                        username: docData.admin.username,
                        password: shaNewPass
                      }

                      this.db.collection('--db_meta--').doc('data').update({
                        admin: newMetaAdmin
                      }).then(() => {
                        this.$emit('submitting', false)
                        this.$q.notify({
                          color: 'green',
                          message: '<div align="center">Sucessful!<div>',
                          html: true,
                          timeout: 750
                        })
                      })
                    } else { // if the old_pw is not same as real
                      this.$emit('submitting', false)
                      this.$q.dialog({
                        title: 'Error!',
                        message: 'The password was incorrect!'
                      })
                    }
                  } else { // if there is no db_meta.data
                    this.$emit('submitting', false)
                    this.$q.dialog({
                      title: 'Error!',
                      message: 'Db_Meta.data does not exists.'
                    })
                  }
                })
            }
          })
        })
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    invokeFilePicker: function (entry) {
      this.$refs[entry][0].click()
    },
    filePickerOnChange: function (entry, key) {
      let eventHandler = async (e, entry) => {
        if (!e.target.files[0]) {
          this.$refs[entry][0].src = this.data.extraKeywordsData[key] ||
            '../statics/images/other-icon.png'
        } else {
          try {
            await this.onFileSelected(e.target.files[0], this.$refs[entry][0])
          } catch (err) {
            if (err) {
              // error
            }
          }
        }
      }

      eventHandler(event, entry)
    },
    onFileSelected: function (file, target) {
      // https://stackoverflow.com/questions/3814231/loading-an-image-to-a-img-from-input-file
      let reader = new FileReader()

      reader.onload = (event) => {
        target.src = event.target.result
      }

      reader.readAsDataURL(file)
    },
    keywordsDelete: function (key) {
      if (key in this.data.extraKeywordsData) {
        this.fileDeleteQueue.push(key)
      }
      delete this.data.keywords[key]

      this.$forceUpdate()
    },
    addKeywords: function () {
      this.$q.dialog({
        title: 'Add new keyword',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          if (!(data in this.data.keywords)) {
            this.data.keywords[data] = data.toLowerCase()

            this.$forceUpdate()
          }
        } else {
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
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
    onSubmit: function () {
      // start loading
      this.$emit('submitting', true)

      // int casting the data.props
      this.data.pagination = parseInt(this.data.pagination)
      this.data.newFlag = parseInt(this.data.newFlag)

      // getting ready to put keywords images into storage
      let promises = []
      let keysWithNewImage = []

      for (let prop in this.data.keywords) {
        if (this.$refs[`input${prop}`][0].files[0]) {
          let storagePath = `configs/keywords/${prop}.png`
          let file = this.$refs[`input${prop}`][0].files[0]

          keysWithNewImage.push(prop)

          promises.push(this.storage.ref().child(storagePath).put(file))
        }
      }

      return Promise.all(promises).then(res => {
        // getting ready to get download url for the image files
        promises = []

        res.forEach(storedFile => {
          promises.push(storedFile.ref.getDownloadURL())
        })

        return Promise.all(promises)
      }).then(res => {
        // put the download links into the extraKeywordsData
        let key = ''
        for (let i = 0; i < keysWithNewImage.length; i++) {
          key = keysWithNewImage[i]
          this.data.extraKeywordsData[key] = res[i]
        }

        // getting ready to delete images if keywords were deleted
        promises = []

        if (this.fileDeleteQueue.length > 0) {
          this.fileDeleteQueue.forEach(queuedKey => {
            let storagePath = `configs/keywords/${queuedKey}.png`

            delete this.data.extraKeywordsData[queuedKey]
            promises.push(this.storage.ref().child(storagePath).delete())
          })
        }

        return Promise.all(promises)
      }).then(() => {
        // finally updating to the database
        return this.db.collection('config').doc('project').update(this.data)
      }).then(() => {
        // write to SessionStorage to save some read
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        storedConfig.keywords = this.data.keywords
        storedConfig.enabledChallenges = this.data.enabledChallenges

        this.$q.sessionStorage.set('boundless_config', storedConfig)

        // update the keywords for Challenges and Projects Config
        this.$emit('keywords', this.data.keywords)

        // finish loading
        this.$emit('submitting', false)
        return 'SUCCESS'
      }).catch(err => {
        if (err) {
          // error
          return 'ERROR'
        }
      })
    },
    getInformation: function () {
      this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            this.data = doc.data()

            this.data.enabledChallenges = this.data.enabledChallenges || false

            // TODO: take these out once the functions are done
            delete this.data.db
            delete this.data.config_version
            delete this.data.suggestedKeywords
            // delete this.data.keywords
            delete this.data.chipContentType
            delete this.data.bodyContentType
            delete this.data.allowedDomain

            this.$emit('usersConfigInfo', this.data.socialNetwork)
            this.$emit('challengesConfigInfo', this.data.challengesConfig)
            this.$emit('projectsConfigInfo', this.data.projectsConfig)
            this.$emit('keywords', this.data.keywords)

            delete this.data.socialNetwork
            delete this.data.challengesConfig
            delete this.data.projectsConfig
          } else {
            /* Config file does not exists in the database! */
          }
        })
        .catch(error => {
          if (error) {
            // error
          }
        })
    },
    fieldParser: function (val) {
      if (val === 'db') {
        return 'Database'
      } else {
        let strTokens = val.split(/(?=[A-Z])/)
        for (let i = 0; i < strTokens.length; i++) {
          strTokens[i] = strTokens[i][0].toUpperCase() + strTokens[i].slice(1).toLowerCase()
        }
        return strTokens.join(' ')
      }
    }
  }
}
</script>

<style>

</style>
