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

Name:     pages/DisplayChallenges.vue
Purpose:  Display the short summary of of all challenges in a table
Methods:
  * Filters challenges via string matching
  * Searchbar for filter param
  * Dropbox for filter param
  * Clickable icons for filter param
  * Redirect to individual challenge

## -->

<template>
  <q-page class="q-pa-lg" style="min-width: 620px;">
    <!-- -------------------- Page Loader -------------------- -->
    <div v-if="loading" class="absolute-center">
      <q-spinner color="primary" size="8em" />
    </div>

    <!-- ------------------ Main Content ------------------ -->
    <div v-else>
      <Banner :bannerObj="bannerObj" />

      <div
        align="center" class="text-caption text-italic"
        style="font-size: 18px;"
      >
        List of Challenges for Others to Consider Solving
      </div>

      <!-- --------------- By The Numbers on Project Display --------------- -->
      <div class="q-pa-sm q-mb-sm">
        <div class="row" align="center">

          <div class="col" @click="filter = ''" >
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ challengeList.length }}
            </strong>

            <br>

            <strong>Challenges</strong>

            <br>

            <q-img
              class="cursor-pointer"
              src="../statics/images/challenge-icon1.png"
              style="height: 40px; max-width: 45px"
            />
          </div>

          <div class="col">
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ sponsorList.length }}
            </strong>

            <br>

            <strong>Sponsors</strong>

            <br>

            <q-icon
              name="person"
              size="45px"
            />
          </div>

          <div
            v-for="(key, ind) in keywordsInUse"
            :key="ind"
            class="col" @click="filter = key"
          >
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ keywordsCounter[key] ? keywordsCounter[key] : 0 }}
            </strong>

            <br>

            <strong>{{ keywordsValToKeyMap[key] }}</strong>

            <br>

            <img
              class="cursor-pointer"
              :src="keywordsImage[key] || '../statics/images/other-icon.png'"
              style="height: 40px; max-width: 45px"
            />
          </div>

          <div
            v-for="(val, valInd) in (5 - keywordsInUse.length)"
            :key="valInd"
            class="col"
          >
            <!-- PLACEHOLDING FOR THE BANNER -->
          </div>

        </div>
      </div>

      <!-- -------------------- Project Display Table -------------------- -->
      <q-table
        class="my-sticky-header-table"
        row-key="project"
        :data="challengeList"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right>

          <q-toolbar>
            <q-btn
              round dense flat
              class="q-mr-xs" icon="menu"
            >
              <q-menu dense>
                <q-list
                  v-for="(keyword, index) in popkeywords"
                  :key="index"
                  style="min-width: 100px"
                >
                  <q-item clickable v-close-popup dense>
                    <q-item-section @click="filter = keyword.value">
                      {{ keyword.label }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-btn>

            <q-space />

            <q-input
              dense
              debounce="300" color="primary" placeholder="keyword search"
              style="min-width: 400px;"
              v-model="filter"
            >
              <template v-slot:append>
                <q-icon v-if="filter === ''" name="search" />

                <q-icon
                  v-else
                  name="clear" class="cursor-pointer" @click="filter = ''"
                />

              </template>
            </q-input>
          </q-toolbar>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="font-size: 18px; font-weight: normal;"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props" >
          <q-tr :props="props">

            <q-td key="new" :props="props">
              <q-icon
                v-if="todayDate <= (props.row.created ? props.row.created.substring(0, 10) : props.row.timestamp.substring(0, 10))"
                name="fiber_new" color="accent" size="2.5em"
              />
              <div hidden>
                {{ joinKeywords(props.row.keywords) }}
              </div>
            </q-td>

            <q-td
              key="challenge"
              :props="props"
              auto-width
            >
              <div
                align="left"
                style="max-width: 200px; white-space: normal;"
              >
                <b>{{ props.row.challenge }}</b>
              </div>
            </q-td>

            <q-td
              key="description"
              :props="props"
              style="max-width: 300px; min-width: 220px;"
            >
              <div class="row">
                <div
                  class="col"
                  ref="descriptionDiv"
                  align="left"
                  style="overflow: hidden;"
                  @click="popDialog(props.row.description)"
                >
                  {{ props.row.description }}
                </div>
                <div
                  class="col-2"
                  :hidden="!(props.row.description.length > 40)"
                >
                  <div
                    class="text-blue cursor-pointer"
                    @click="popDialog(props.row.description)"
                  >
                    &nbsp;&nbsp;[more ...]
                  </div>
                </div>
              </div>
            </q-td>

            <q-td
              key="priority"
              :props="props"
              style="min-width: 150px;"
            >
              <div>
                <q-knob
                  show-value readonly
                  size="4em" class="q-ma-md" track-color="grey-3"
                  v-model="priorityGague.val[props.row.priority]"
                  :angle="225"
                  :max="360"
                  :thickness="0.4"
                  :color="priorityGague.color[props.row.priority]"
                >
                  <strong>
                    {{ priorityGague.text[props.row.priority] }}
                  </strong>
                </q-knob>
              </div>

            </q-td>

            <q-td
              key="length"
              :props="props"
              style="max-width: 150px;"
            >
              <div>
                {{ props.row.projects.length }}
              </div>
            </q-td>

            <q-td
              key="url"
              :props="props"
            >
              <q-chip
                dense clickable
                color="info" text-color="white"
                label="more..."
                @click="displayChallengePage(props.row.alias || props.row.uuid)"
              />
            </q-td>

          </q-tr>
        </template>

      </q-table>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="fixedDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Project Description</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="width: 50vh; height: 40vh; overflow: auto">
            <p>
              {{ rowMessage }}
            </p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

  </q-page>
</template>

<script>
import { defaultImages, layoutConfig } from '../../boundless.config'

import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import Banner from '../components/Banners/Banner'

export default {
  components: {
    Banner
  },
  created () {
    // enable or disable challenges depending on admin configuration
    // TODO: check inside routes.js using beforeRoute
    if (this.$q.sessionStorage.has('boundless_config')) {
      let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
      this.layoutConfig = layoutConfig

      if (typeof cachedConfig.enabledChallenges === 'boolean') {
        this.layoutConfig.challenges = cachedConfig.enabledChallenges
      }
    } else {
      this.layoutConfig = layoutConfig
    }

    // if disabled, redirect to 404
    if (!this.layoutConfig.challenges) {
      this.$router.push('/err')
    }
    // TODO: remove the code above after route handler

    // fetech data from database
    this.loadFireRefs().then(res => {
      this.loadConfig()
      this.loadChallengeList()
    })
  },
  data () {
    return {
      db: null, // <Object>: firebase firestore credentials
      layoutConfig: null, // <Object>: configurations related to layout
      bannerObj: { // <Object>: default banner object
        // path <String>: file path of the default image
        path: `../statics/${defaultImages.challenges.tableBanner}`,
        ratio: '8', // <String>: ratio of the banner
        type: 'table', // <String>: type of the banner
        category: 'challenges' // <String>: category of the banner
      },
      // keywords <Array<String>>: list of keywords appearing in all challenges
      keywords: [],
      keywordsInUse: [], // <Array<String>>: list of keywords in use
      keywordsCounter: {}, // <Map>: map of how many times each keywords appear
      keywordsValToKeyMap: {}, // <Map>: map of value to key of keywords
      keywordsImage: {}, // <Map>: map of keyword's images
      popkeywords: [], // <Array<Object>>: dropdown menu values
      todayDate: '', // <Date>: today's date
      rowMessage: '', // <String>: description of the challenge to be displayed
      fixedDialog: false, // <Boolean>: trigger for pop-up dialog
      filter: '', // <String>: value of the search
      loading: true, // <Boolean>: flag for the page loading
      challengeList: [], // <Array<Object>>: list of all the challenges in ToC
      sponsorList: [], // <Array<String>>: array of emails
      pagination: { // <Object>: pagination object for the table
        sortBy: 'new', // <String>: name of the column to be sorted
        rowsPerPage: 50 // <Integer>: numbers of projects to display by default
      },
      // columns <Array<Object>>: column layout of the display table
      columns: [
        {
          name: 'new',
          label: 'New',
          field: row => row.created || row.timestamp,
          align: 'center',
          sortable: true,
          sort: (a, b) => (b > a) ? 1 : ((a > b) ? -1 : 0)
        },
        {
          name: 'challenge',
          required: true,
          label: 'Challenge Name',
          align: 'center',
          field: row => row.challenge,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'description',
          align: 'center',
          label: 'Description',
          field: row => row.description
        },
        {
          name: 'priority',
          align: 'center',
          label: 'Priority',
          field: row => row.priority,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'length',
          align: 'center',
          label: '# Projects',
          field: row => row.projects,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'url',
          align: 'center',
          label: 'Details',
          field: row => row.keywords
        }
      ],
      priorityGague: { // <Object>: data for knob animation
        val: [0, 90, 180, 270],
        color: ['green', 'green', 'yellow-8', 'red'],
        text: ['Null', 'Long', 'Med', 'Short']
      }
    }
  },
  methods: {
    loadFireRefs: function () {
      /*
      // load firebase database reference
      // load firebase storage reference (if applicable)
      // load firebase cloud functions reference (if applicable)
      // params: <void>
      // return: <Promise<String>>
      */

      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')

        return new Promise((resolve, reject) => {
          // loading firebase references
          if (sessionDb === 'testing') {
            this.db = testingDb
          } else {
            this.db = productionDb
          }
          resolve('Database fetch complete...')
        })
      } else {
        return new Promise((resolve, reject) => {
          return productionDb.collection('config').doc('project').get()
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
    displayChallengePage: function (entry) {
      /*
      // either route push to the challenge page or open new window
      // params:
      //    @entry <String>: uuid or the alias of the challenge
      // return: <void>
      */

      const eventHandler = (e, entry) => {
        if (e.ctrlKey) {
          let routeData = this.$router.resolve(`challenge/${entry}`, '/')
          window.open(routeData.href, '_blank')
        } else {
          this.$router.push(`/challenge/${entry}`)
        }
      }

      // calling the event handler
      eventHandler(event, entry)
    },
    displayMembers: function (entry) {
      /*
      // create a list of sponsors who are in charge of of the challenge
      // params:
      //    @entry <Array<Object>>: list of sponsor objects
      // return: <String>
      */

      let retMembers = ''

      entry.forEach(sponsor => {
        if (sponsor.role === 'lead') {
          retMembers += ', ' + sponsor.name
        }
      })

      return retMembers.substring(2, retMembers.length)
    },
    joinKeywords: function (entry) {
      /*
      // helper function to join keywords
      // params:
      //    @entry <Array<String>>: string array with keywords to be appeneded
      // return: <String>
      */

      return entry.join(', ')
    },
    popDialog: function (entry) {
      /*
      // trigger the description pop-up dialog
      // params:
      //    @entry <String>: description of the challenge
      // return: <void>
      */

      this.fixedDialog = true
      this.rowMessage = entry
    },
    loadChallengeList: function () {
      /*
      // loads the list of all the challenges from the db and
      // assign them to component states
      // params: <void>
      // return: <Promise<Boolean>>
      */

      return this.db.collection('challenges').doc('ToC').get().then(doc => {
        if (doc.exists) {
          for (let challenge in doc.data()) {
            if (challenge !== 'alias') {
              if (!doc.data()[challenge].hidden) {
                // getting the project list
                this.challengeList.push(doc.data()[challenge])

                doc.data()[challenge].sponsors.forEach(sponsor => {
                  if (sponsor.email && !this.sponsorList.includes(sponsor.email)) {
                    this.sponsorList.push(sponsor.email)
                  } else if (sponsor.uuid && !this.sponsorList.includes(sponsor.uuid)) {
                    this.sponsorList.push(sponsor.uuid)
                  }
                })

                // getting the keywords
                if (doc.data()[challenge].keywords.length > 0) {
                  doc.data()[challenge].keywords.forEach(keyword => {
                    this.keywords.push(keyword)
                  })
                }
              }
            }
          }
        } else {
          throw new Error('No document named ToC inside the collection.')
        }
        this.gettingCount()

        return true
      }).then(() => {
        // done loading
        this.loading = false
        return true
      }).catch(error => {
        if (error) {
          // error
          return false
        }
      })
    },
    loadConfig: function () {
      /*
      // load the config form the db
      // TODO: this should be replaced since config/project is cached in session
      // params: <void>
      // return: <Promise<Boolean>>
      */

      return this.db.collection('config').doc('project').get().then(doc => {
        if (doc.exists) {
          let data = doc.data()

          // extracting keywords for the banner and dropdown filter
          // non-sorted to maintain order for now
          // let cachedKeywords = data.challengesConfig.keywords.sort()
          // let cachedKeywords = data.challengesConfig.keywords

          for (let key in data['keywords']) {
            this.popkeywords.push({
              label: key,
              value: data['keywords'][key]
            })

            this.keywordsValToKeyMap[data['keywords'][key]] = key

            // if (
            //   !cachedKeywords.includes(data['keywords'][key]) &&
            //   cachedKeywords.length < 5
            // ) {
            //   cachedKeywords.push(data['keywords'][key])
            // }
          }

          // this.keywordsInUse = cachedKeywords
          this.keywordsInUse = data.challengesConfig.keywords

          // make sure the database response has extraKeywordsData
          if (data.extraKeywordsData) {
            // loading the image url from extraKeywordsData
            let key = ''
            for (let prop in data.extraKeywordsData) {
              key = prop.toLowerCase()
              this.keywordsImage[key] = data.extraKeywordsData[prop] ||
                this.keywordsImage[key]
            }
          }

          if (typeof data['pagination'] === 'number') {
            this.pagination.rowsPerPage = data['pagination']
          }

          let expireDate = data.newFlag * 24 * 60 * 60 * 1000
          this.todayDate = new Date(Date.now() - expireDate)
          this.todayDate = this.todayDate.toISOString().substring(0, 10)

          return true
        }
        throw new Error('File not found!')
      }).catch(err => {
        if (err) {
          return false
        }
      })
    },
    gettingCount: function () {
      /*
      // counting how many times the keywords appear inside the ToC
      // params: <void>
      // return: <void>
      */

      this.keywords.forEach(val => {
        if (val in this.keywordsCounter) {
          this.keywordsCounter[val] = this.keywordsCounter[val] + 1
        } else {
          this.keywordsCounter[val] = 1
        }
      })
    }
  }
}
</script>

<style lang="stylus">

</style>
