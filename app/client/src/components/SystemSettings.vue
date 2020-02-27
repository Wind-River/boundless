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
    <div class="q-pa-md">
      <div>
        <div class="row">
          <div class="text-h6 col-2 q-pt-sm" >
            About Logo:
          </div>

          <q-list class="col q-pl-lg">
            <q-item style="border-radius: 3px;">
              <q-item-section>
                <input
                  label="Choose Custom Logo"
                  type="file" accept="image/*"
                  @change="aboutLogoImageSelect"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div>
          <q-list>
            <q-item
              v-if="file.file"
              style="height: 27vh;"
            >
              <q-item-section
                class="hoverable"
                :style="!data.generalConfig.leftImg.active ? selectedStyle : ''"
                @click="
                  data.generalConfig.leftImg.active = false; updated = true
                "
              >
                <div>
                  <q-img
                    contain
                    class="center-img"
                    :src="`../statics/images/boundless-logo2.png`"
                    :ratio="4/3"
                    style="max-height: 15vh;"
                  >
                    <div class="absolute-bottom-right text-subtitle2">
                      Default
                    </div>
                  </q-img>
                </div>
              </q-item-section>

              <q-item-section
                class="hoverable"
                :style="data.generalConfig.leftImg.active ? selectedStyle : ''"
                @click="
                  data.generalConfig.leftImg.active = true; updated = true
                "
              >
                <div>
                  <q-img
                    contain
                    class="center-img"
                    :src="file.url"
                    :ratio="4/3"
                    style="max-height: 15vh;"
                  >
                    <div class="absolute-bottom-right text-subtitle2">
                      File
                    </div>
                  </q-img>
                </div>
              </q-item-section>
            </q-item>

            <q-item
              v-else-if="
                !data.generalConfig || !data.generalConfig.leftImg ||
                !data.generalConfig.leftImg.url
              "
              style="height: 20vh;"
            >
              <q-item-section
                class="hoverable"
                :style="selectedStyle"
              >
                <div>
                  <q-img
                    contain
                    class="center-img"
                    :src="`../statics/images/boundless-logo2.png`"
                    :ratio="4/3"
                    style="max-height: 15vh;"
                  >
                    <div class="absolute-bottom-right text-subtitle2">
                      Default
                    </div>
                  </q-img>
                </div>
              </q-item-section>
            </q-item>

            <q-item v-else style="height: 27vh;" >
              <q-item-section
                class="hoverable"
                :style="!data.generalConfig.leftImg.active ? selectedStyle : ''"
                @click="
                  data.generalConfig.leftImg.active = false; updated = true
                "
              >
                <div>
                  <q-img
                    contain
                    class="center-img"
                    :src="`../statics/images/boundless-logo2.png`"
                    :ratio="4/3"
                    style="max-height: 15vh;"
                  >
                    <div class="absolute-bottom-right text-subtitle2">
                      Default
                    </div>
                  </q-img>
                </div>
              </q-item-section>

              <q-item-section
                class="hoverable"
                :style="data.generalConfig.leftImg.active ? selectedStyle : ''"
                @click="
                  data.generalConfig.leftImg.active = true; updated = true
                "
              >
                <div>
                  <q-img
                    contain
                    class="center-img"
                    :src="data.generalConfig.leftImg.url"
                    :ratio="10/3"
                    style="max-height: 15vh;"
                  >
                    <div class="absolute-bottom-right text-subtitle2">
                      Storage
                    </div>
                  </q-img>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <hr>

      <div
        v-for="(val, field, index) in data"
        :key="index"
      >
        <!-- TODO: REMOVE THIS ONCE EXTRAKEYWORDSDATA IS REMOVED -->
        <div
          v-if="
            ![
              'extraKeywordsData', 'generalConfig',
              'enabledChallenges', 'wikiInfo'
            ].includes(field)
          "
        >
          <div class="row">

            <div class="text-h6 col-2">{{ fieldParser(field) }}:</div>

            <!-- Column For Buttons -->
            <div
              v-if="field !== 'newFlag' && field !== 'pagination'"
              class="col-2 q-pl-xl q-ml-xs"
            >
              <div v-if="field === 'keywords'">
                <q-btn
                  dense round
                  color="accent" size="md" icon="add"
                  @click="addKeywords"
                />
              </div>

              <div v-else-if="field === 'customChips'" class="q-pt-md">
                <q-btn
                  dense round
                  color="accent" size="md" icon="add"
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
                      :src="data.extraKeywordsData[key] ||
                        '../statics/images/other-icon.png'
                      "
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

            <div v-else class="highlight col q-py-sm q-pl-lg q-ml-lg" >
              <b>{{ val }}</b>
              <q-popup-edit
                :title="`Edit ${fieldParser(field)}`"
                v-model="data[field]"
                buttons
                @save="updated = true"
              >
                <q-input
                  dense autofocus filled
                  v-model="data[field]"
                />
              </q-popup-edit>
            </div>
          </div><hr>

        </div>

        <div v-else-if="field === 'enabledChallenges'">
          <div class="row">

            <div class="text-h6 col-2">{{ fieldParser(field) }}:</div>

            <div class="col q-pl-lg" >
              <q-item tag="label" v-ripple style="border-radius: 3px;">
                <!-- <q-item-section>
                </q-item-section> -->
                <q-item-section avatar>
                  <q-toggle
                    color="green"
                    v-model="data.enabledChallenges"
                    @input="invokeChallengesEnabler"
                  />
                </q-item-section>
              </q-item>
            </div>
          </div><hr>

        </div>

      </div>

      <div class="q-pa-md q-gutter-sm">
        <q-btn
          :disabled="!updated" no-caps
          class="float-right"
          color="secondary" label="Submit"
          @click="onSubmit"
        />

        <q-btn
          v-if="$q.sessionStorage.has('admin_token')"
          no-caps outline
          label="Edit About Page"
          @click="aboutDialog.dialog = true"
        />

        <!-- TODO: dialog for edit wiki -->
        <q-btn
          v-if="$q.sessionStorage.has('admin_token')"
          no-caps outline
          label="Wiki URL"
          @click="wikiDialog.dialog = true"
        />

        <q-btn
          v-if="$q.sessionStorage.has('admin_token')"
          no-caps outline
          label="Change Admin Password"
          @click="invokeAdminPassChange"
        />

      </div>
    </div>

    <!-- -------------------- Edit About Page Dialog -------------------- -->
    <q-dialog
      v-model="aboutDialog.dialog"
      persistent
      :maximized="aboutDialog.maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />

          <q-btn
            :disable="!aboutDialog.maximizedToggle"
            dense flat
            icon="minimize"
            @click="aboutDialog.maximizedToggle = false"
          >
            <q-tooltip
              v-if="aboutDialog.maximizedToggle"
              content-class="bg-white text-primary"
            >
              Minimize
            </q-tooltip>
          </q-btn>

          <q-btn
            :disable="aboutDialog.maximizedToggle"
            dense flat
            icon="crop_square"
            @click="aboutDialog.maximizedToggle = true"
          >
            <q-tooltip
              v-if="!aboutDialog.maximizedToggle"
              content-class="bg-white text-primary"
            >
              Maximize
            </q-tooltip>
          </q-btn>

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>

        </q-bar>

        <q-card-section>
          <div class="text-h6">Editing About Page</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <EditableMarkdown :db="db" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- -------------------- Edit Wiki URL Dialog -------------------- -->
    <q-dialog
      v-model="wikiDialog.dialog"
      persistent buttons
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 30%;">
        <q-card-section class="">
          <div class="text-h6">Editing Wiki URL</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- <EditableMarkdown :db="db" /> -->
          <div v-if="data.wikiInfo" class="q-gutter-md">
            <q-input
              outlined dense
              v-model="data.wikiInfo.name"
              label="Wiki Name"
              @input="forceUpdateWOSubmit"
            />
            <q-input
              outlined dense
              v-model="data.wikiInfo.url"
              label="Wiki Link"
              @input="forceUpdateWOSubmit"
            />
          </div>
        </q-card-section>

        <q-card-actions class="" align="right">
          <q-btn v-close-popup outline color="primary" label="Cancel" />
          <q-btn
            v-close-popup outline
            color="primary" label="Submit"
            @click="wikiSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'

import sha256 from 'sha256'

import EditableMarkdown from '../components/Markdown'

export default {
  components: {
    EditableMarkdown
  },
  created () {
    this.getDb().then(res => {
      this.getInformation()
    })
  },
  beforeDestroy () {
    if (!this.submitted && this.updated) {
      this.$q.dialog({
        title: 'Are you sure you want to leave without submitting? (All data will be lost).',
        cancel: {
          flat: true,
          noCaps: true,
          label: 'Submit'
        },
        ok: {
          flat: true,
          noCaps: true,
          label: 'Leave'
        },
        persistent: true
      }).onOk(() => {
      }).onCancel(() => {
        this.onSubmit()
      })
    }
  },
  data () {
    return {
      db: null,
      storage: null,
      fileDeleteQueue: [],
      data: {},
      aboutDialog: {
        dialog: false,
        maximizedToggle: true
      },
      wikiDialog: {
        dialog: false
      },
      file: {
        file: '',
        prev: '',
        url: ''
      },
      selectedStyle: {
        boxShadow: '0px 0px 0px 3px black inset',
        borderRadius: '3px'
      },
      updated: false,
      submitted: false
    }
  },
  methods: {
    wikiSubmit: function () {
      this.$emit('submitting', true)
      let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

      storedConfig.wikiInfo = this.data.wikiInfo

      return this.db.collection('config').doc('project').update(storedConfig)
        .then(() => {
          this.$q.sessionStorage.set('boundless_config', storedConfig)
          this.$emit('submitting', false)
          return true
        })
    },
    forceUpdateWOSubmit: function () {
      this.$forceUpdate()
    },
    aboutLogoImageSelect: function (e) {
      let reader = new FileReader()
      this.file.file = e.target.files[0]

      if (this.file.file) {
        this.data.generalConfig.leftImg.active = true
        this.file.prev = this.data.generalConfig.leftImg.url

        reader.onload = (event) => {
          this.file.url = event.target.result
        }

        reader.readAsDataURL(this.file.file)
      } else {
        this.data.generalConfig.leftImg.active = false
        this.file.url = this.file.prev
      }

      this.updated = true
    },
    invokeChallengesEnabler: function () {
      this.updated = true
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
              this.updated = true
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
      this.updated = true
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
            this.updated = true
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

      this.updated = true
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

            this.updated = true
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
        if (this.file.file) {
          // write logo to storage
          return this.storage.ref().child(
            'configs/about/left.png'
          ).put(this.file.file).then(res => {
            // get the logo url
            return res.ref.getDownloadURL().then(res => {
              this.data.generalConfig.leftImg.url = res
              return true
            })
          })
        } else {
          return 'NO NEED'
        }
      }).then(() => {
        // finally updating to the database
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        storedConfig.generalConfig = storedConfig.generalConfig || {}
        storedConfig.generalConfig = {
          ...storedConfig.generalConfig,
          leftImg: this.data.generalConfig.leftImg
        }

        this.data.generalConfig = storedConfig.generalConfig

        return this.db.collection('config').doc('project').update(this.data)
      }).then(() => {
        // write to SessionStorage to save some read
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        storedConfig.keywords = this.data.keywords
        storedConfig.enabledChallenges = this.data.enabledChallenges

        storedConfig.generalConfig = storedConfig.generalConfig || {}
        storedConfig.generalConfig = {
          ...storedConfig.generalConfig,
          leftImg: this.data.generalConfig.leftImg
        }

        this.$q.sessionStorage.set('boundless_config', storedConfig)

        // update the keywords for Challenges and Projects Config
        this.$emit('keywords', this.data.keywords)

        // finish loading
        this.submitted = true
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
      return this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            this.data = doc.data()

            this.data.enabledChallenges = this.data.enabledChallenges || false

            // dealing with about logo to bind with 'Edit About Page'
            if (!this.data.generalConfig) {
              this.data.generalConfig = {
                leftImg: {
                  url: '',
                  active: false
                }
              }
            } else {
              let ssRef = this.$q.sessionStorage
              let storedConfig = ssRef.getItem('boundless_config')

              if (!storedConfig.generalConfig.leftImg) {
                this.data.generalConfig = {
                  ...storedConfig.generalConfig,
                  leftImg: {
                    url: '',
                    active: false
                  }
                }
              }
            }

            // dealing with 'Wiki URL'
            if (!this.data.wikiInfo) {
              this.data.wikiInfo = {
                name: '',
                url: ''
              }
            }

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

<style lang="stylus">

</style>
