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

Name:     pages/Index.vue
Purpose:  About page of the boundless innovation program
Methods:
  * Displays the quick summary of how many projects, innovators, and challanges are currently registered

## -->

<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="absolute-center">
      <q-spinner color="primary" size="8em" />
    </div>

    <div
      v-else
      class="row shadow-2"
      style="
        margin: auto;
        max-width: 99%;
        min-width: 800px;
        border-radius: 3px;
      "
    >

      <!-- -------------------- Left QCard -------------------- -->
      <div
        class="col-3 q-mt-sm q-mb-sm q-ml-sm q-pa-sm shadow-2"
        style="
          overflow: auto;
          border-radius: 3px;
          min-width: 300px;
        "
        align="center"
      >
        <!-- -------------------- HAIRCOUNT SESSIONS -------------------- -->
        <q-card
          v-if="layoutConfig.hairCut"
          class="cursor-pointer"
          style="height: 270px;"
          @click="routeHairCutPage"
        >
          <div>
            <hr>
            <strong class="title-font-1">Rabih's Haircut Challenge</strong>
            <hr>
          </div>

          <HairCut
            :hairCount="250 - projectList.length - challengeList.length - 10"
          />

          <div
            class="hairCutTarget q-mr-xs text-blue-6"
          >
            Learn more...
          </div>
        </q-card>

        <!-- -------------------- BY THE NUMBER SESSION -------------------- -->
        <div>
          <div>
            <hr>
            <strong class="title-font-1">By The Numbers</strong>
            <hr>
          </div>

          <div>
            <div class="row q-mt-sm">
              <div class="col">
                <span
                  class="text-blue-4"
                  style="font-size: 20px"
                >
                  <strong>
                    {{ projectList.length }}
                  </strong>
                </span>
              </div>

              <div class="col q-mt-xs">
                <strong>Projects</strong>
              </div>

              <div class="col q-mb-sm">
                <q-img
                  src="../statics/images/projects-icon.png"
                  style="height: 40px; max-width: 45px"
                />
              </div>
            </div>

            <q-separator inset />

            <div
              v-if="layoutConfig && layoutConfig.challenges"
              class="row q-mt-sm"
            >
              <div class="col">
                <span
                  class="text-blue-4"
                  style="font-size: 20px"
                >
                  <strong>
                    {{ challengeList.length }}
                  </strong>
                </span>
              </div>

              <div class="col q-mt-xs">
                <strong>Challenges</strong>
              </div>

              <div class="col q-mb-sm">
                <q-img
                  src="../statics/images/challenge-icon1.png"
                  style="height: 40px; max-width: 45px"
                />
              </div>
            </div>
            <q-separator inset />

            <div class="row q-mt-sm">
              <div class="col">
                <span
                  class="text-blue-4"
                  style="font-size: 20px"
                >
                  <strong>
                    {{ innovatorList.length }}
                  </strong>
                </span>
              </div>

              <div class="col q-mt-xs">
                <strong>Innovators</strong>
              </div>

              <div class="col q-mb-sm">
                <q-img
                  src="../statics/images/innovator-icon.png"
                  style="height: 40px; max-width: 45px"
                />
              </div>
            </div>

            <q-separator inset />

            <div
              v-if="layoutConfig && layoutConfig.challenges"
              class="row q-mt-sm"
            >
              <div class="col">
                <span
                  class="text-blue-4"
                  style="font-size: 20px"
                >
                  <strong>
                    {{ sponsorList.length }}
                  </strong>
                </span>
              </div>

              <div class="col q-mt-xs">
                <strong>Sponsors</strong>
              </div>

              <div class="col q-mb-sm">
                <q-icon
                  name="person"
                  size="45px"
                />
              </div>
            </div>

            <q-separator inset />

            <div
              v-for="(key, ind) in keywordsInUse"
              :key="ind"
            >
              <div class="row q-mt-sm">
                <div class="col">
                  <span
                    class="text-blue-4"
                    style="font-size: 20px"
                  >
                    <strong>
                      {{ keywordsCounter[key] }}
                    </strong>
                  </span>
                </div>

                <div class="col q-mt-xs">
                  <strong>{{ keywordsValToKeyMap[key] }}</strong>
                </div>

                <div class="col q-mb-sm">
                  <q-img
                    :src="keywordsImage[key]"
                    style="height: 40px; max-width: 45px"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- -------------------- Right QCard -------------------- -->
      <div class="col q-pa-sm">
        <div
          class="q-pa-sm row bg-primary"
          style="height: 100%; border-radius: 3px; overflow: auto;"
        >

          <!-- -------------------- Image -------------------- -->
          <div class="col-3 q-pa-sm">
            <br class="small">
            <q-img
              v-if="layoutConfig.defaultImg"
              class="local-img" border="true"
              :src="`statics/${layoutConfig.defaultImg}`"
              :ratio="1/1.0"
            />
            <q-img
              v-else
              class="local-img" border="true"
              src="statics\images\home-main-image.jpg"
              :ratio="1/1.0"
            />
          </div>

          <!-- -------------------- Text -------------------- -->
          <div class="col-9 q-pa-lg overviewCSS bg-primary">
            <div v-if="layoutConfig.companyName" class="text-h4 text-white">
              Innovation Tracking @ {{ layoutConfig.companyName }}
            </div>
            <div v-else class="text-h4 text-white">
              Innovation Tracking
            </div>

            <hr class="newColor">

            <div
              class="text-white"
              style="
                font-size: 16px;
                font-family: Tahoma, Verdana, Segoe, sans-serif;
              "
            >

              <p>
                Employee driven innovations {{ layoutConfig.companyName ? `@ ${layoutConfig.companyName}` : '' }} are tracked here. An innovation may include (but not limited to):
                <ul>
                  <li> cool fun demo (e.g., Internet connected coffee maker);</li>
                  <li> new tool or process that make other Wind River groups or customers more productive;</li>
                  <li> new product feature;</li>
                  <li> platform extensions (e.g., VxWorks, Linux, Titanium);</li>
                  <li> customer or trade show demo;</li>
                  <li> new open source solution; or</li>
                  <li> explore a technology you have an interest in </li>
                </ul>
              </p><br>

              <hr class="newColor">

              <q-icon name="visibility" style="font-size: 1.5em; bottom: 2px;" />&nbsp;<router-link class="text-info" :to="'/project/display'">View Projects</router-link> &nbsp;

              <q-icon name="add_box" style="font-size: 1.5em; bottom: 2px;" />&nbsp;<router-link class="text-info" :to="'/project/add'">Submit Project</router-link> &nbsp;

              <span v-if="layoutConfig.homeName && layoutConfig.homeURL">
                <q-icon name="home" style="font-size: 1.5em; bottom: 2px;" /> <a :href="layoutConfig.homeURL" class="text-info">Boundless Program {{ layoutConfig.homeName }} Home Page</a> &nbsp;
              </span>

            </div>
          </div>
          <!-- ---------------------------------------- -->
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import HairCut from '../components/HairCut'

import { layoutConfig } from '../../boundless.config'

export default {
  components: {
    HairCut
  },
  created () {
    this.loadFireRef().then(res => {
      this.loadInformation()

      if (this.$q.sessionStorage.has('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
        this.layoutConfig = layoutConfig

        if (typeof cachedConfig.enabledChallenges === 'boolean') {
          this.layoutConfig.challenges = cachedConfig.enabledChallenges
        }
      } else {
        this.layoutConfig = layoutConfig
      }
    })
  },
  data () {
    return {
      db: null, // <Object>: firebase credentials
      layoutConfig: null, // <Object>
      loading: true, // <Boolean>
      projectList: [], // <Array<Object>>
      challengeList: [], // <Array<Object>>
      innovatorList: [],
      sponsorList: [],
      keywords: [], // <Array<String>>
      keywordsInUse: [],
      keywordsCounter: {},
      keywordsValToKeyMap: {},
      keywordsImage: {
        vxworks: '../statics/images/VxWorksLogo.png',
        linux: '../statics/images/Linux-icon.png',
        simics: '../statics/images/simics-icon.png',
        helix: '../statics/images/other-icon.png',
        titanium: '../statics/images/TiS-icon.png',
        complier: '../statics/images/other-icon.png'
      }
    }
  },
  methods: {
    loadFireRef: function () {
      /*
      // load firebase database reference
      // load firebase storage reference (if applicable)
      // load firebase cloud functions reference (if applicable)
      // return: Promise<String>
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
                reject('"/config/project" path does not exists in the database...(Index)')
              }
            })
        }).catch(err => {
          if (err) {
            this.db = productionDb
          }
        })
      }
    },
    gettingCount: function () {
      /*
      // TODO: function description
      */

      this.keywords.forEach(val => {
        if (val in this.keywordsCounter) {
          this.keywordsCounter[val] = this.keywordsCounter[val] + 1
        } else {
          this.keywordsCounter[val] = 1
        }
      })
    },
    routeHairCutPage: function () {
      /*
      // routes to the HairCut page by opening a new tab
      */

      let routeData = this.$router.resolve({
        name: 'HairCut'
      }, '/')
      window.open(routeData.href, '_blank')
    },
    loadInformation: function () {
      /*
      // load the minimun database information to the respective component var
      // return:
      */

      return this.db.collection('projects').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            for (let project in doc.data()) {
              if (project !== 'alias') {
                if (!doc.data()[project].hidden) {
                  // getting the project list
                  this.projectList.push(project)

                  // getting the innovator list
                  if (doc.data()[project].members.length > 0) {
                    doc.data()[project].members.forEach(member => {
                      if (
                        member.email &&
                        !this.innovatorList.includes(member.email)
                      ) {
                        this.innovatorList.push(member.email)
                      } else if (
                        member.uuid && !this.innovatorList.includes(member.uuid)
                      ) {
                        this.innovatorList.push(member.uuid)
                      }
                    })
                  }

                  // getting the keywords
                  if (doc.data()[project].keywords.length > 0) {
                    doc.data()[project].keywords.forEach(keyword => {
                      this.keywords.push(keyword)
                    })
                  }
                }
              }
            }
          } else {
            throw new Error('Required document not found!')
          }

          this.gettingCount()
        })
        .then(() => {
          this.db.collection('challenges').doc('ToC').get()
            .then(doc => {
              if (doc.exists) {
                for (let challenge in doc.data()) {
                  if (challenge !== 'alias') {
                    if (!doc.data()[challenge].hidden) {
                      this.challengeList.push(challenge)

                      doc.data()[challenge].sponsors.forEach(sponsor => {
                        if (
                          sponsor.email &&
                          !this.sponsorList.includes(sponsor.email)
                        ) {
                          this.sponsorList.push(sponsor.email)
                        } else if (
                          sponsor.uuid &&
                          !this.sponsorList.includes(sponsor.uuid)
                        ) {
                          this.sponsorList.push(sponsor.uuid)
                        }
                      })

                      // // ommiting the keywords from challenges
                      // if (doc.data()[challenge].keywords.length > 0) {
                      //   doc.data()[challenge].keywords.forEach(keyword => {
                      //     this.keywords.push(keyword)
                      //   })
                      // }
                    }
                  }
                }
              }

              this.loading = false
            })
        })
        .catch(err => {
          if (err) {
            setTimeout(() => {
              this.loading = false
            }, 300)
          }
        })
    }
  }
}
</script>

<style lang="stylus">
ul {
  list-style-type: none;
  position: relative;
}

ul li::before {
  content: "\25A0";
  color: #C00000;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
  line-height: 1em;
  font-size: 1.1em;
}

.local-img {
  border: 1px solid DimGray;
  border-radius: 4px;
  padding: 5px
}

.overviewCSS {
  max-height: 450px;
}

.hairCutTarget {
  position: absolute;
  bottom: 0;
  right: 0;
}

.title-font-1 {
  font-size: 18px;
  color: #C00000;
}
</style>
