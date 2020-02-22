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

Name:     components/SettingPanels/Config.vue
Purpose:
Methods:
  *

## -->

<template>
  <div :hidden="loading">
    <!-- -------------------- Progress Bar -------------------- -->
    <div v-if="data.progressBar">
      <div
        v-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        Project Progress Bar
        <q-separator color="secondary" />
      </div>

      <div class="row">
        <div class="col-2 q-px-lg">
          Tags:
        </div>

        <div class="col-2 q-pl-lg q-ml-xs">
          <q-btn
            dense round
            color="accent" size="md" icon="add"
            @click="addProgressTag"
          />
        </div>

        <div class="col">
          <q-chip
            v-for="(arrVal, arrInd) in data.progressBar.tags" :key="arrInd"
            color="primary" text-color="white"
            :label='arrVal'
            removable
            @remove="deleteProgressTag(arrInd)"
          />
        </div>

      </div>

      <div class="row">
        <div class="col-2 q-px-lg q-my-md">
          Half-step:
        </div>

        <div class="col q-pt-sm">
          <q-item tag="label" v-ripple style="border-radius: 3px;">
            <!-- <q-item-section>
            </q-item-section> -->
            <q-item-section avatar>
              <q-toggle
                color="green"
                v-model="data.progressBar.half"
                @input="forceUpdate()"
              />
            </q-item-section>
          </q-item>
        </div>
      </div>

    </div>

    <!-- -------------------- Keywords -------------------- -->
    <div>

      <div
        v-if="type === 'challenges'"
        class="text-h4 q-mb-md"
      >
        Challenge Keywords
        <q-separator color="secondary" />
      </div>

      <div
        v-else-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        Project Keywords
        <q-separator color="secondary" />
      </div>

      <q-option-group
        v-if="data.keywords"
        dense inline
        class="q-px-lg q-py-md"
        color="primary" type="checkbox"
        :options="keywordOptions"
        v-model="data.keywords"
        @input="checkMax"
      />

      <p v-if="data.keywords" class="q-px-lg q-py-md">
        Selected keywords: {{ data.keywords }} <br >
        This is the order in which the keywords appear in banner.
      </p>
    </div>

    <!-- -------------------- Listing Table -------------------- -->
    <div>
      <div
        v-if="type === 'challenges'"
        class="text-h4 q-mb-md"
      >
        Challenge Listing Page
        <q-separator color="secondary" />
      </div>

      <div
        v-else-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        Project Listing Page
        <q-separator color="secondary" />
      </div>

      <div>
        <div
          v-if="data.listingTable !== undefined"
          class="q-pa-lg"
        >
          <hr>
          <div>
            <strong>
              Listing Banner:
            </strong>
            <q-list>
              <q-item tag="label" v-ripple style="border-radius: 3px;">
                <q-item-section>
                  <q-item-label>Choose Custom Banner</q-item-label>
                </q-item-section>

                <input
                  hidden
                  type="file" accept="image/*"
                  @change="filePickerOnChange(type, 'listingTable.bannerImg'); updated = true"
                />
              </q-item>

              <q-item
                v-if="!data.listingTable.bannerImg.url" style="height: 27vh;"
              >
                <q-item-section
                  class="hoverable"
                  :style="
                    !data.listingTable.bannerImg.active ? selectedStyle : ''
                  "
                  @click="
                    data.listingTable.bannerImg.active = false; updated = true
                  "
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-else style="height: 20vh;">
                <q-item-section
                  class="hoverable"
                  :style="!data.listingTable.bannerImg.active ? selectedStyle : ''"
                  @click="data.listingTable.bannerImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.tableBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>

                <q-item-section
                  class="hoverable"
                  :style="data.listingTable.bannerImg.active ? selectedStyle : ''"
                  @click="data.listingTable.bannerImg.active = true; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      :src="data.listingTable.bannerImg.url"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <hr>
        </div>
      </div>
    </div>

    <!-- -------------------- Display Page -------------------- -->
    <div>
      <div
        v-if="type === 'challenges'"
        class="text-h4 q-mb-md"
      >
        Challenge Display Page
        <q-separator color="secondary" />
      </div>

      <div
        v-else-if="type === 'projects'"
        class="text-h4 q-mb-md"
      >
        Project Display Page
        <q-separator color="secondary" />
      </div>

      <div>
        <div
          v-if="data.webpage !== undefined"
          class="q-pa-lg"
        >
          <hr>
          <div>
            <strong>
              Page Banner:
            </strong>
            <q-list>
              <q-item tag="label" v-ripple style="border-radius: 3px;">
                <q-item-section>
                  <q-item-label>Choose Custom Banner</q-item-label>
                </q-item-section>

                <input
                  hidden
                  type="file" accept="image/*"
                  @change="filePickerOnChange(type, 'webpage.bannerImg'); updated = true"
                />
              </q-item>

              <q-item v-if="!data.webpage.bannerImg.url" style="height: 27vh;">
                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.bannerImg.active ? selectedStyle : ''"
                  @click="data.webpage.bannerImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-else style="height: 20vh;">
                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.bannerImg.active ? selectedStyle : ''"
                  @click="data.webpage.bannerImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      v-if="type === 'challenges'"
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.challenges.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />

                    <q-img
                      v-else
                      contain
                      class="center-img"
                      :src="`../statics/${staticImages.projects.webBanner}`"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>

                <q-item-section
                  class="hoverable"
                  :style="data.webpage.bannerImg.active ? selectedStyle: ''"
                  @click="data.webpage.bannerImg.active = true; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      :src="data.webpage.bannerImg.url"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <hr>

          <div>
            <strong>
              Page Image:
            </strong>
            <q-list>
              <q-item tag="label" v-ripple style="border-radius: 3px;">
                <q-item-section>
                  <q-item-label>Choose Custom Image</q-item-label>
                </q-item-section>

                <input
                  hidden
                  type="file" accept="image/*"
                  @change="
                    filePickerOnChange(type, 'webpage.mainImg');
                    updated = true
                  "
                />
              </q-item>

              <q-item v-if="!data.webpage.mainImg.url" style="height: 27vh;">
                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.mainImg.active ? selectedStyle : ''"
                  @click="data.webpage.mainImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      src="https://placeimg.com/500/300/nature"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-else style="height: 20vh;">
                <q-item-section
                  class="hoverable"
                  :style="!data.webpage.mainImg.active ? selectedStyle : ''"
                  @click="data.webpage.mainImg.active = false; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      src="https://placeimg.com/500/300/nature"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>

                <q-item-section
                  class="hoverable"
                  :style="data.webpage.mainImg.active ? selectedStyle: ''"
                  @click="data.webpage.mainImg.active = true; updated = true"
                >
                  <div>
                    <q-img
                      contain
                      class="center-img"
                      :src="data.webpage.mainImg.url"
                      :ratio="ratio"
                      style="max-height: 150px;"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <hr>
        </div>
      </div>
    </div>

    <!-- -------------------- Button -------------------- -->
    <div class="q-px-lg q-pb-lg">
      <div class="q-px-md q-pb-md q-gutter-sm" align="right">
        <q-btn
          no-caps
          color="secondary" label="Submit"
          @click="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defaultImages } from '../../../boundless.config'

import productionDb, { productionStorage } from '../../firebase/init_production'
import testingDb, { testingStorage } from '../../firebase/init_testing'

export default {
  props: {
    keywords: Object,
    type: String,
    configs: Object,
    ratio: String
  },
  created () {
    setTimeout(() => {
      this.loading = false
    }, 100)

    this.getDb().then(() => {
      // data fetching goes here
      this.data = this.deepObjCopy(this.configs)

      if (
        this.type === 'projects' &&
        typeof this.data.progressBar === 'undefined'
      ) {
        this.data.progressBar = {
          tags: ['Idea', 'PoC', 'Value'],
          half: true
        }
      }

      for (let key in this.keywords) {
        this.keywordOptions.push({
          label: key,
          value: this.keywords[key]
        })
      }
    })
  },
  beforeDestroy () {
    if (!this.submitted && this.updated) {
      this.$q.dialog({
        title: 'You sure you want to leave without submitting? All the changes will be lost.',
        cancel: {
          flat: true,
          label: 'Submit'
        },
        persistent: true
      }).onOk(() => {
        if (this.data.listingTable.bannerImg.url) {
          URL.revokeObjectURL(this.data.listingTable.bannerImg.url)
        }
        if (this.data.webpage.bannerImg.url) {
          URL.revokeObjectURL(this.data.webpage.bannerImg.url)
        }
        if (this.data.webpage.mainImg.url) {
          URL.revokeObjectURL(this.data.webpage.mainImg.url)
        }
      }).onCancel(() => {
        this.onSubmit()
      })
    }
  },
  data () {
    return {
      loading: true,
      selectedStyle: {
        border: 'solid 3px',
        borderRadius: '3px'
      },
      db: null,
      storage: null,
      staticImages: defaultImages,
      keywordOptions: [],
      data: {},
      counter: 0,
      endCounter: 0,
      submitted: false,
      updated: false
    }
  },
  methods: {
    addProgressTag: function () {
      this.$q.dialog({
        title: 'Add new tag for progress bar',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (
          data && data.length < 7 &&
          !(data in this.data.progressBar.tags) &&
          this.data.progressBar.tags.length < 4
        ) {
          this.data.progressBar.tags.push(data)

          this.$forceUpdate()
        } else if (data.length > 6) {
          this.$q.notify({
            message: 'Tag must be at most 6 characters!',
            icon: 'warning',
            color: 'negative'
          })
        } else if (this.data.progressBar.tags.length >= 4) {
          this.$q.notify({
            message: 'Must have at most 4 tag for the progress bar!',
            icon: 'warning',
            color: 'negative'
          })
        } else {
          this.$q.notify({
            message: 'Tag cannot be empty!',
            icon: 'warning',
            color: 'negative'
          })
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    deleteProgressTag: function (index) {
      if (this.data.progressBar.tags.length > 1) {
        this.data.progressBar.tags.splice(index, 1)
        this.$forceUpdate()
      } else {
        this.$q.notify({
          message: 'Must have at least 1 tag for the progress bar!',
          icon: 'warning',
          color: 'negative'
        })
      }
    },
    forceUpdate: function () {
      this.$forceUpdate()
    },
    checkMax: function (entry) {
      if (entry.length > 5) {
        this.$q.notify({
          color: 'negative',
          icon: 'warning',
          position: 'bottom',
          message: 'Maximun of 5 keywords only.',
          timeout: 500
        })

        entry.pop()
        this.data.keywords = entry
      }
    },
    getBlobAndSubmitFromURL: function (url, property, obj) {
      // https://stackoverflow.com/questions/11876175/how-to-get-a-file-or-blob-from-an-object-url
      fetch(url).then(res => {
        return res.blob()
      })
        .then(res => {
          this.storage.ref()
            .child(
              `configs/${this.type}/${property}/${obj}.png`
            )
            .put(res)
            .then(ss => {
              ss.ref.getDownloadURL().then(dlURL => {
                URL.revokeObjectURL(url)
                this.data[property][obj].url = dlURL
                delete this.data[property][obj].prev
                this.counter = this.counter + 1
                if (this.counter === this.endCounter) {
                  this.db.collection('config').doc('project').set({
                    [`${this.type}Config`]: this.data
                  }, { merge: true })

                  this.counter = 0
                  this.$emit('submitting', false)
                  this.$emit('submitted', this.data)
                }
              })
            })
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
      this.endCounter = 0
      this.submitted = true
      this.$emit('submitting', true)

      let blobFlag = false

      for (let property in this.data) {
        for (let obj in this.data[property]) {
          let blobURL = this.data[property][obj].url
          if (blobURL && blobURL.split(':')[0] === 'blob') {
            blobFlag = true
            this.endCounter = this.endCounter + 1
            this.getBlobAndSubmitFromURL(blobURL, property, obj)
          }
        }
      }

      if (!blobFlag) {
        this.db.collection('config').doc('project').set({
          [`${this.type}Config`]: this.data
        }, { merge: true })

        if (this.$q.sessionStorage.has('boundless_config')) {
          let dbConfig = this.$q.sessionStorage.getItem('boundless_config')
          dbConfig[`${this.type}Config`] = this.data

          this.$q.sessionStorage.set('boundless_config', dbConfig)
        }

        setTimeout(() => {
          this.$emit('submitting', false)
          this.$emit('submitted', this.data)
        }, 300)
      }
    },
    filePickerOnChange: function (type, field) {
      const eventHandler = (e, type, field) => {
        const file = e.target.files[0]
        let fToken = field.split('.')

        if (file) {
          this.data[fToken[0]][fToken[1]].prev = this.data[fToken[0]][fToken[1]].url
          this.data[fToken[0]][fToken[1]].url = URL.createObjectURL(file)

          this.data[fToken[0]][fToken[1]].active = true
        } else {
          URL.revokeObjectURL(this.data[fToken[0]][fToken[1]].url)
          this.data[fToken[0]][fToken[1]].url = this.data[fToken[0]][fToken[1]].prev
          delete this.data[fToken[0]][fToken[1]].prev

          if (!this.data[fToken[0]][fToken[1]].url) {
            this.data[fToken[0]][fToken[1]].active = false
          }
        }
      }

      eventHandler(event, type, field)
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

<style>

</style>
