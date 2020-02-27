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

Name:    pages/ViewProject.vue
Purpose:
Methods:
  *

## -->

<template>
  <NotFound v-if="notFound" />
  <q-page v-else class="q-pa-lg">
    <!-- -------------------- Loading -------------------- -->
    <div
      v-if="loading"
      class="absolute-center"
    >
      <q-spinner
        color="primary"
        size="8em"
      />
    </div>

    <div v-else>
      <q-splitter
        v-model="splitterModel"
        disable
      >

        <template v-slot:before>
          <q-tabs
            vertical inline-label stretch
            class="text-primary"
            v-model="pageTab"
          >
            <q-route-tab
              exact no-caps
              name="main" icon="view_stream" label="Main"
              :to="`/project/${projectId}`"
            />
            <q-separator />
            <q-route-tab
              exact no-caps
              name="logs" icon="forum" label="Logs"
              :to="`/project/${projectId}/logs`"
            />
            <q-separator />
            <div v-if="$q.sessionStorage.has('admin_token')">
              <q-route-tab
                no-caps
                name="attachments" icon="attachment" label="Attachments"
                :to="`/project/${projectId}/attachments`"
              />
              <q-separator />
            </div>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="pageTab"
            animated
            transition-prev="scale"
            transition-next="scale"
          >
            <q-tab-panel name="main">
              <Banner
                :bannerObj="bannerObj"
              />

              <div v-if="data">
                <!-- -------------------- Main Page -------------------- -->
                <div
                  align="center"
                  class="shadow-2"
                  style="
                    margin: auto;
                    max-width: 1000px;
                    min-width: 800px;
                    border-radius: 3px;
                  "
                >
                  <br class="small">

                  <!-- ------------------- Project Page -------------------- -->
                  <div class="q-pa-md" align="left">

                    <!-- ------------------ Project Title ------------------ -->
                    <div class="q-pa-md text-h4 text-primary text-center">
                      {{ data.project }}
                      <q-separator />
                    </div>

                    <!-- ----------------- Project Overview ---------------- -->
                    <div
                      class="q-pa-sm q-col-gutter-md row items-start"
                      style="height: 320px;"
                    >

                      <div class="col-9">
                        <div class="text-h5">
                          Overview
                          <q-separator color="secondary" />
                        </div>

                        <div
                          class="row q-mt-sm q-mb-sm"
                          style="max-height: 240px;"
                        >
                          <div class="col-5 q-mt-sm">
                            <!-- --------------- Main Image ---------------- -->
                            <q-img
                              class="project-img bg-black"
                              :src="projectImagePath"
                              :ratio="4/3"
                              contain
                            />
                          </div>

                          <!-- ---------------- Description ---------------- -->
                          <div class="col overviewCSS">

                            <div class="q-pa-sm">
                              <pre>{{ data.description }}</pre>
                            </div>

                          </div>

                        </div>

                      </div>

                      <div class="col-3" >

                        <div class="text-h5">
                          Innovators
                          <q-separator color="secondary" />
                        </div>

                        <div class="overviewCSS">
                          <q-list dense>
                            <q-item
                              v-for="(teamMember, index) in data.members"
                              :key="index"
                              class="q-my-sm"
                              clickable
                              v-ripple
                            >
                              <q-item-section avatar>
                                <q-avatar color="primary" text-color="secondary"  >
                                  {{ teamMember.name[0] }}
                                </q-avatar>
                              </q-item-section>

                              <q-item-section>
                                <q-item-label v-if="teamMember.role === 'lead'">
                                  {{ teamMember.name }}: ({{ teamMember.role }})
                                </q-item-label>
                                <q-item-label v-else>
                                  {{ teamMember.name }}
                                </q-item-label>
                                <q-item-label caption lines="1">
                                  {{ teamMember.email }}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>

                      </div>

                    </div>

                    <q-separator inset />

                    <!-- ------------------- Progress Bar ------------------ -->
                    <div class="q-pa-md" align="center">
                      <div class="text-h5">
                        Progress
                      </div>

                      <ProgressBar
                        class="q-mt-sm progress-bar"
                        :progressBar="progressBar"
                        :progress="data.progress"
                      />
                    </div>

                    <q-separator inset />

                    <!-- ------------------ Project Chips ------------------ -->
                    <div class="q-pa-md" align="center">

                      <q-chip
                        clickable
                        color="secondary" text-color="white"
                        icon="far fa-clipboard"
                        @click="copyURLtoClipboard"
                      >
                        Copy URL
                      </q-chip>

                      <span
                        v-for="(chipContent, chipInd) in data.webpage.chips"
                        :key="chipInd"
                      >
                        <q-chip
                          v-if="!chipContent.hidden"
                          clickable
                          color="secondary" text-color="white"
                          :icon="chipContent.content.icon"
                          @click="openNewTab(chipContent.content.url)"
                        >
                          {{ chipContent.content.label }}
                        </q-chip>
                      </span>

                      <q-chip
                        clickable
                        color="secondary" text-color="white" icon="vpn_key"
                        @click="popDialog('keywords')"
                      >
                        Keywords
                      </q-chip>

                    </div>

                    <!-- -------------------- Body -------------------- -->
                    <div class="q-pa-md">
                      <div
                        v-for="(bodyContent, bodyInd) in data.webpage.body"
                        :key="bodyInd"
                      >
                        <div :hidden="bodyContent.hidden === true">
                          <div class="text-h5 q-mt-sm">
                            {{ bodyContent.content.label }}
                          </div>
                          <q-separator color="secondary" />
                          <div>
                            <div v-if="bodyContent.content.type === 'TEXT_BOX'">
                              <div class="q-pa-sm">
                                <pre>{{ bodyContent.content.text }}</pre>
                              </div>
                            </div>
                            <div v-else>
                              <ul>
                                <li
                                  v-for="(link, ulIndex) in bodyContent.content.list"
                                  :key="ulIndex"
                                >
                                  <div
                                    v-if="bodyContent.content.type === 'EVENT_LIST'"
                                    style="display: inline; padding-left: 12px;"
                                  >
                                    {{ link.subject }}
                                    <hr>
                                    Description: {{ link.body }} <br>
                                    Date and Time: {{ link.date }} <br>
                                    <a v-if="link.url !== ''" :href="link.url">More...</a>
                                  </div>
                                  <span v-else>
                                    <em v-if="link.url === ''">
                                      {{ link.item }}
                                    </em>
                                    <a v-else :href="link.url" target="_blank">
                                      {{ link.item }}
                                    </a>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <br>
                        </div>
                      </div>
                    </div>

                  </div>

                  <br><br>

                </div>

                <!-- -------------------- Popup Dialog -------------------- -->
                <div class="q-pa-md q-gutter-sm">
                  <q-dialog v-model="fixedDialog">
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">{{ dialogJSON.title }}</div>
                      </q-card-section>

                      <q-separator />

                      <q-card-section v-if="dialogJSON.message" style="width: 50vh;">
                        <ul>
                          <li v-for="(val, ind) in dialogJSON.message" :key="ind">
                            {{ val }}
                          </li>
                        </ul>
                      </q-card-section>

                      <q-card-section v-else style="width: 50vh;">
                        <p>N/A</p>
                      </q-card-section>

                      <q-separator />

                      <q-card-actions align="right">
                        <q-btn flat label="Close" color="primary" v-close-popup />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>
              </div>

              <q-inner-loading :showing="!Boolean(projectImagePath)">
                <q-spinner-gears size="50px" color="primary" />
              </q-inner-loading>
            </q-tab-panel>

            <q-tab-panel name="logs">
              <div
                v-if="data"
                align="center" class="shadow-2"
                style="
                  margin: auto;
                  max-width: 1000px;
                  min-width: 800px;
                  border-radius: 3px;
                "
              >
                <div
                  v-if="Array.isArray(data.logs) && data.logs.length > 0"
                  class="q-pa-md q-gutter-sm"
                >
                  <div
                    v-for="(val, ind) in data.logs"
                    :key="ind"
                  >
                    <div
                      v-if="!val.hidden"
                      align="left"
                      class="shadow-2 q-pa-sm"
                      style="border-radius: 3px;"
                    >
                      <div
                        v-ripple
                        class="relative-position cursor-pointer"
                      >
                        {{ val.title }}
                      </div>

                      <div
                        v-if="val.description"
                        class="q-pa-sm"
                      >
                        <pre>{{ val.description }}</pre>
                      </div>

                      <!-- <div
                        v-for="(childVal, childInd) in val.data"
                        :key="childInd"
                      >
                        <dir v-if="!childVal.hidden">
                          <div>
                            Title: {{ childVal.title }}
                          </div>
                          <div>
                            Date: {{ childVal.date }}
                          </div>
                          <div>
                            Description:
                            <hr>
                            <pre>{{ childVal.description }}</pre>
                            <hr>

                            <div align="right">
                              <q-btn
                                dense
                                round
                                flat
                                color="accent"
                                icon="reply"
                                @click="replyLog(ind, childVal)"
                              />
                            </div>
                          </div>
                        </dir>
                      </div> -->
                    </div>
                  </div>
                </div>

                <div v-else>
                  No log currently available...
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="attachments">
              <div
                class="shadow-2 q-pa-md"
                style="
                  margin: auto;
                  max-width: 1000px;
                  min-width: 800px;
                  border-radius: 3px;
                "
              >
                Attachments
                <hr>

                <li
                  v-for="(val, key, ind) in data.files"
                  :key="ind"
                >
                  {{ key }}:
                  <dir>
                    {{ val }}
                  </dir>
                </li>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>

      </q-splitter>
    </div>

  </q-page>
</template>

<script>
import { defaultImages } from '../../boundless.config'

import productionDb, { productionStorage } from '../firebase/init_production'
import testingDb, { testingStorage } from '../firebase/init_testing'

import Banner from '../components/Banners/Banner'
import ProgressBar from '../components/ProgressBar'

import NotFound from './Error404'

export default {
  components: {
    NotFound,
    Banner,
    ProgressBar
  },
  created () {
    this.setPageTab()

    // fetch data from database
    this.loadFireRefs().then(res => {
      this.loadInformation()
      this.loadProgressBarConf()
    })
  },
  beforeUpdate () {
    this.setPageTab()
    this.loadProgressBarConf()

    this.$q.sessionStorage.set('boundless_page_info', {
      key: this.projectId,
      data: this.data
    })
  },
  updated () {
  },
  beforeDestroy () {
    this.$q.sessionStorage.remove('boundless_page_info')
  },
  data () {
    return {
      progressBar: {
        tags: ['Idea', 'PoC', 'Value'],
        half: true
      },
      db: null,
      storage: null,
      bannerObj: {
        path: `../statics/${defaultImages.projects.webBanner}`,
        ratio: '8',
        type: 'webpage',
        category: 'projects'
      },
      projectImagePath: '',
      fixedDialog: false,
      dialogJSON: {
        title: '',
        message: ''
      },
      projectId: this.$route.params.project_id,
      loading: true,
      data: {},
      notFound: false,
      pageTab: '',
      splitterModel: 15
    }
  },
  methods: {
    test: function () {
      // test code goes here
    },
    loadProgressBarConf: function () {
      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

        if (cachedConfig.projectsConfig.progressBar) {
          this.progressBar = cachedConfig.projectsConfig.progressBar
        }
      }
    },
    setPageTab: function () {
      /*
      // TODO: add function description
      */

      if (this.$route.params.extraRoute === 'logs') {
        this.pageTab = 'logs'
      } else {
        this.pageTab = 'main'
      }
    },
    replyLog: function (familyIndex, responseObj) {
      /*
      // TODO: add function description
      */

      this.$q.dialog({
        dark: true,
        title: 'Response...',
        message: '<strong>Please enter your response.</strong><br><br><p class="text-red">Note: Your reponse cannot be empty!</p>',
        html: true,
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data) {
          let tmpLog = {
            title: `In respones to: "${responseObj.title}"!`,
            date: Date(),
            description: `>>>>>>>>>>\n${responseObj.description}\n>>>>>>>>>>\n${data}`,
            hidden: false
          }

          // let size = this.curData.logs[familyIndex].data.length

          this.data.logs[familyIndex].data.push(tmpLog)
          // let size = this.curData.logs[index].data.length
          // this.updated = true

          this.$forceUpdate()

          this.db.collection('projects').doc(this.data.uuid).set({
            logs: this.data.logs
          }, { merge: true })
        } else {
          this.$q.notify({
            message: 'Not a valid response!',
            color: 'negative',
            icon: 'report_problem'
          })
        }
      }).onCancel(() => {
        // nothing goes here
      }).onDismiss(() => {
        // nothing goes here
      })
    },
    loadFireRefs: function () {
      /*
      // load firebase database reference
      // load firebase storage reference (if applicable)
      // load firebase cloud functions reference (if applicable)
      // return: Promise<String>
      */

      if (this.$q.localStorage.has('boundless_db')) {
        // TODO: add description
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
    updateId: function () {
      /*
      // TODO: add function description
      // return:
      */

      this.projectId = this.$route.params.project_id

      if (this.$q.sessionStorage.has('boundless_page_info')) {
        let storageData = this.$q.sessionStorage.getItem('boundless_page_info')
        if (storageData.key === this.projectId) {
          this.data = storageData.data
        } else {
          this.loadInformation()
        }
      } else {
        this.loadInformation()
      }
    },
    loadInformation: function () {
      /*
      // TODO: add function description
      */

      // start loading
      this.loading = true

      // return the promise to check for alias
      return new Promise((resolve, reject) => {
        this.db.collection('projects').doc('ToC').get()
          .then(doc => {
            if (doc.exists) {
              if (doc.data().alias && doc.data().alias.hasOwnProperty(this.projectId)) {
                let actualUid = doc.data().alias[this.projectId]
                resolve(doc.data()[actualUid])
              } else if (doc.data().hasOwnProperty(this.projectId)) {
                resolve(doc.data()[this.projectId])
              } else {
                reject('UUID nor the ALIAS exists!')
              }
            } else {
              reject('ToC does not exists!')
            }
          }).catch(err => {
            reject(err)
          })
      }).then(res => {
        return new Promise((resolve, reject) => {
          this.db.collection('projects').doc(res.uuid).get()
            .then(doc => {
              if (doc.exists) {
                for (let objField in res) {
                  this.data[objField] = res[objField]
                }

                for (let objField in doc.data()) {
                  this.data[objField] = doc.data()[objField]
                }

                this.sortBody()
                this.sortChip()

                if (!this.data.webpage.imgURL) {
                  this.projectImagePath = this.getMainPhoto()
                } else {
                  this.storage.ref().child(this.data.webpage.imgURL).getDownloadURL()
                    .then(url => {
                      this.projectImagePath = url
                    })
                    .catch(err => {
                      if (err) {
                        this.projectImagePath = this.getMainPhoto()
                      }
                    })
                }

                resolve()
              } else {
                reject('Document containing webpage information is either corrupted or no longer available!')
              }
            }).catch(err => {
              reject(err)
            })
        })
      }).then(() => {
        return new Promise((resolve, reject) => {
          let tmpMembers = []
          if (this.data.members[0].email) {
            // handling old data
            this.data.members.forEach(member => {
              tmpMembers.push({
                uuid: member.uuid || member.email,
                role: member.role
              })
            })

            this.data.members = tmpMembers
            tmpMembers = []
          }
          let correctionReq = false // bool to check if data correction req
          let uuidList = [] // list to correct data in db

          // handling new data
          this.db.collection('users').doc('ToC').get()
            .then(doc => {
              if (doc.exists) {
                this.data.members.forEach(member => {
                  // check if uuid return empt user
                  if (!doc.data()[member.uuid]) {
                    // hard check if the user is not in db
                    for (let userUid in doc.data()) {
                      if (doc.data()[userUid].email === member.uuid) {
                        tmpMembers.push({
                          ...doc.data()[userUid],
                          role: member.role
                        })
                        uuidList.push({
                          uuid: userUid,
                          role: member.role
                        })

                        correctionReq = true
                        break
                      }
                    }
                  } else {
                    tmpMembers.push({
                      ...doc.data()[member.uuid],
                      role: member.role
                    })
                    uuidList.push({
                      uuid: member.uuid,
                      role: member.role
                    })
                  }
                })

                this.data.members = tmpMembers

                if (correctionReq) {
                  this.db.collection('projects').doc('ToC').set({
                    [this.data.uuid]: {
                      members: uuidList
                    }
                  }, { merge: true })
                }

                setTimeout(() => {
                  this.loading = false
                  resolve()
                }, 100)
              } else {
                reject('Document containing webpage information is either corrupted or no longer there!')
              }
            }).catch(err => {
              reject(err)
            })
        })
      }).catch(err => {
        if (err) {
          setTimeout(() => {
            this.notFound = true
          }, 1500)
        }
      })
    },
    popDialog: function (entry) {
      /*
      // TODO: add function description
      */

      if (entry === 'awards') {
        this.dialogJSON['title'] = 'Impact Awards'
      } else {
        this.dialogJSON['title'] = entry.charAt(0).toUpperCase() + entry.slice(1)
      }
      this.dialogJSON['message'] = this.data[entry]
      this.fixedDialog = true
    },
    getMainPhoto: function () {
      /*
      // TODO: add function description
      */

      let val = `statics/images/computer-keyboard.jpg`

      if (this.$q.sessionStorage.has('boundless_config')) {
        let storedConfig = this.$q.sessionStorage.getItem('boundless_config')

        if (
          storedConfig && storedConfig.projectsConfig &&
          storedConfig.projectsConfig.webpage &&
          storedConfig.projectsConfig.webpage.mainImg.url &&
          storedConfig.projectsConfig.webpage.mainImg.active
        ) {
          val = storedConfig.projectsConfig.webpage.mainImg.url
        }
      }

      return val
    },
    sortBody: function () {
      /*
      // TODO: add function description
      */

      this.data.webpage.body.sort((a, b) => {
        return a.index - b.index
      })

      this.data.webpage.body.forEach(webContent => {
        if (webContent.content.type === 'ORDERED_LIST') {
          webContent.content.list.sort((a, b) => {
            return a.index - b.index
          })
        }
      })
    },
    sortChip: function () {
      /*
      // TODO: add function description
      */

      this.data.webpage.chips.sort((a, b) => {
        return a.index - b.index
      })
    },
    copyURLtoClipboard: function () {
      /*
      // https://stackoverflow.com/questions/6725890/location-host-vs-location-hostname-and-cross-browser-compatibility
      // TODO: add function description
      */

      if (!window.location.origin) {
        window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '')
      }

      let routeData = window.location.origin + '/' + this.$router.resolve('', this.$route).href
      this.copyTextToClipboard(routeData)

      this.$q.notify({
        message: 'The URL has been copied to the clipboard.',
        position: 'top',
        timeout: 2000,
        color: 'info',
        textColor: 'white',
        actions: [
          {
            icon: 'close',
            color: 'white'
          }
        ]
      })
    },
    fallbackCopyTextToClipboard: function (entry) {
      /*
      // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
      // TODO: add function description
      */

      let textArea = document.createElement('textarea')
      textArea.value = entry
      document.body.prepend(textArea)
      // textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (err) {
        if (err) {
          // error
        }
      }

      document.body.removeChild(textArea)
    },
    copyTextToClipboard: function (entry) {
      /*
      // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
      // TODO: add function description
      */

      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(entry)
        // return
      } else {
        navigator.clipboard.writeText(entry).then(function () {
        }, function (err) {
          if (err) {
          }
        })
      }
    },
    openNewTab: function (entry) {
      /*
      // TODO: add function description
      */

      window.open(entry, '_blank')
    }
  },
  watch: {
    $route: 'updateId'
  }
}
</script>

<style lang="stylus" scoped>
h4 {
  font-size: 2.0em;
  margin: 10px;
  padding: 10px;
}

.project-img {
  border: 3px solid #ddd;
  border-radius: 4px;
  padding: 5px
}

ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "\25A0";       // Add content: \25A0 is the CSS Code/unicode for a block bullet
  color: $secondary;      // Set the color
  font-weight: bold;
  display: inline-block;  // add space between the bullet and the text
  width: 1em; // space between bullet and text
  margin-left: -2em; // space between bullet and margin
}

.overviewCSS {
  max-height: 240px;
  overflow: auto;
}

div::-webkit-scrollbar {
  width: 3px;
}

div::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 2px;
}

div::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 3px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}
</style>
