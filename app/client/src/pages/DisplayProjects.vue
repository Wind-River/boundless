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

Name:     pages/DisplayProjects.vue
Purpose:
Methods:
  *

## -->

<template>
  <q-page class="q-pa-lg" style="min-width: 620px;">
    <!-- -------------------- Page Loader -------------------- -->
    <div v-if="loading" class="absolute-center">
      <q-spinner color="primary" size="8em" />
    </div>
    <div v-else>
      <Banner
        :bannerObj="bannerObj"
      />

      <!-- --------------- By The Numbers on Project Display --------------- -->
      <div class="q-pa-sm q-mb-sm">
        <div class="row" align="center">

          <div
            class="col"
            @click="filter = ''"
          >
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ projectList.length }}
            </strong>
            <br>
            <strong>Projects</strong>
            <br>
            <q-img
              class="cursor-pointer"
              src="../statics/images/projects-icon.png"
              style="height: 40px; max-width: 45px"
            />
          </div>

          <div class="col">
            <strong class="text-blue-4" style="font-size: 20px" >
              {{ memberList.length }}
            </strong>

            <br>

            <strong>Innovators</strong>

            <br>

            <q-img
              src="../statics/images/innovator-icon.png"
              style="height: 40px; max-width: 45px"
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
        :data="projectList"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right>

          <q-toolbar>
            <q-btn
              dense flat round
              @click="openTutorialVideo"
            >
              <q-icon
                name="ondemand_video" size="24px" color="secondary"
              />
              <q-tooltip
                anchor="center left" self="center right"
                :offset="[10, 10]"
              >
                'Search' video tutorial
              </q-tooltip>
            </q-btn>
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
              debounce="300"
              color="primary" placeholder="keyword search"
              style="min-width: 400px;"
              v-model="filter"
            >
              <template v-slot:append>
                <q-icon v-if="filter === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
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

            <q-td
              key="new"
              :props="props"
              style="width: 95px;"
            >
              <q-icon
                v-if="todayDate <= (props.row.created ? props.row.created.substring(0, 10) : props.row.timestamp.substring(0, 10))"
                name="fiber_new"
                color="accent"
                size="2.5em"
              />
              <div hidden>
                {{ joinKeywords(props.row.keywords) }}
              </div>
            </q-td>

            <q-td key="project" :props="props" auto-width>
              <div
                align="left"
                style="max-width: 200px; white-space: normal;"
              >
                <b>{{ props.row.project }}</b>
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
                  @click="popDialog(props.row.description)"
                  align="left"
                  style="overflow: hidden;"
                >
                  {{ props.row.description }}
                </div>
                <div class="col-2" :hidden="!(props.row.description.length > 40)">
                  <div
                    class="text-blue cursor-pointer"
                    @click="popDialog(props.row.description)"
                  >
                    &nbsp;&nbsp;[more ...]
                  </div>
                </div>
              </div>
            </q-td>
            <q-td key="progress" :props="props">
              <div style="min-width: 150px; max-width: 250px; border: solid 1px; border-color: #d0d7e2;">

                <div class="row" v-if="props.row.progress === -1">
                  <div class="col null-color">
                    Idea
                  </div>
                  <div class="col null-color">
                    PoC
                  </div>
                  <div class="col null-color">
                    Value
                  </div>
                </div>

                <div class="row" v-if="props.row.progress === 0">
                  <div class="col half-full-color">
                    Idea
                  </div>
                  <div class="col null-color">
                    PoC
                  </div>
                  <div class="col null-color">
                    Value
                  </div>
                </div>

                <div class="row" v-if="props.row.progress === 1">
                  <div class="col full-color">
                    Idea
                  </div>
                  <div class="col null-color">
                    PoC
                  </div>
                  <div class="col null-color">
                    Value
                  </div>
                </div>

                <div class="row" v-if="props.row.progress === 2">
                  <div class="col full-color">
                    Idea
                  </div>
                  <div class="col half-full-color">
                    PoC
                  </div>
                  <div class="col null-color">
                    Value
                  </div>
                </div>

                <div class="row" v-if="props.row.progress === 3">
                  <div class="col full-color">
                    Idea
                  </div>
                  <div class="col full-color">
                    PoC
                  </div>
                  <div class="col null-color">
                    Value
                  </div>
                </div>

                <div class="row" v-if="props.row.progress === 4">
                  <div class="col full-color">
                    Idea
                  </div>
                  <div class="col full-color">
                    PoC
                  </div>
                  <div class="col half-full-color">
                    Value
                  </div>
                </div>

                <div class="row" v-if="props.row.progress === 5">
                  <div class="col full-color">
                    Idea
                  </div>
                  <div class="col full-color">
                    PoC
                  </div>
                  <div class="col full-color">
                    Value
                  </div>
                </div>

              </div>

            </q-td>
            <q-td
              key="members"
              :props="props"
              style="max-width: 150px; overflow: hidden;"
            >
              <div align="left">
                {{ displayMembers(props.row.members) }}
              </div>
            </q-td>
            <q-td key="url" :props="props">
              <q-chip
                dense
                clickable
                @click="displayProjectPage(props.row.alias || props.row.uuid)"
                color="info"
                text-color="white"
                label="more..."
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
import { defaultImages } from '../../boundless.config'

import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import Banner from '../components/Banners/Banner'

export default {
  name: 'DisplayTable_Test',
  components: {
    Banner
  },
  created () {
    // fetches data from database
    this.getDb().then(res => {
      this.getProjectList()
      this.loadInformation()
    })
  },
  data () {
    return {
      db: null,
      bannerObj: {
        path: `../statics/${defaultImages.projects.tableBanner}`,
        ratio: '8',
        type: 'table',
        category: 'projects'
      },
      userToC: {},
      memberList: [],
      // keywords related variables should be consolidated
      keywords: [],
      keywordsInUse: [],
      keywordsCounter: {},
      keywordsValToKeyMap: {},
      keywordsImage: {
        vxworks: '../statics/images/VxWorksLogoB-n-W.png',
        linux: '../statics/images/Linux-icon.png',
        simics: '../statics/images/simics-icon.png',
        helix: '../statics/images/other-icon.png',
        titanium: '../statics/images/TiS-icon.png',
        complier: '../statics/images/other-icon.png'
      },
      popkeywords: [],
      //
      todayDate: '',
      rowMessage: '',
      fixedDialog: false,
      filter: '',
      loading: true,
      projectList: [],
      pagination: {
        sortBy: 'new',
        rowsPerPage: 50
      },
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
          name: 'project',
          required: true,
          label: 'Project Name',
          align: 'center',
          field: row => row.project,
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
          name: 'progress',
          align: 'center',
          label: 'Progess',
          field: row => row.progress,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'members',
          align: 'center',
          label: 'Lead(s)',
          field: row => row.members,
          format: val => {
            let membersRetVal = ''
            val.forEach(entry => {
              if (entry.role === 'lead') {
                membersRetVal += entry.name + ', '
              }
            })
            return membersRetVal.substring(0, membersRetVal.length - 2)
          },
          sortable: true
        },
        {
          name: 'url',
          align: 'center',
          label: 'Details',
          field: row => row.keywords
        }
      ]
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
    openTutorialVideo: function () {
      window.open('https://www.youtube.com', '_blank')
    },
    displayProjectPage: function (entry) {
      let routeData = this.$router.resolve('project/' + entry, '/')
      window.open(routeData.href, '_blank')
    },
    displayMembers: function (entry) {
      let retMembers = ''
      entry.forEach(member => {
        if (member.role === 'lead') {
          if (member.email) {
            retMembers += ', ' + member.name
          } else {
            retMembers += ', ' + this.userToC[member.uuid].name
          }
        }
      })
      return retMembers.substring(2, retMembers.length)
    },
    joinKeywords: function (entry) {
      return entry.join(', ')
    },
    popDialog: function (entry) {
      this.fixedDialog = true
      this.rowMessage = entry
    },
    // columnsFont: function () {
    //   this.columns.forEach(entry => {
    //     entry.style = {
    //       fontSize: '18px'
    //       // fontWeight: 'bold'
    //     }
    //   })
    // },
    getProjectList: function () {
      this.db.collection('projects').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            for (let project in doc.data()) {
              if (project !== 'alias') {
                if (!doc.data()[project].hidden) {
                  // getting the project list
                  this.projectList.push(doc.data()[project])

                  // getting the innovator list
                  if (doc.data()[project].members.length < 1) {
                    /* console.log('Members_Array is empty!') */
                  } else if (doc.data()[project].members.length === 1) {
                    if (doc.data()[project].members[0].email && !this.memberList.includes(doc.data()[project].members[0].email)) {
                      this.memberList.push(doc.data()[project].members[0].email)
                    } else if (doc.data()[project].members[0].uuid && !this.memberList.includes(doc.data()[project].members[0].uuid)) {
                      this.memberList.push(doc.data()[project].members[0].uuid)
                    }
                  } else {
                    doc.data()[project].members.forEach(member => {
                      if (member.email && !this.memberList.includes(member.email)) {
                        this.memberList.push(member.email)
                      } else if (member.uuid && !this.memberList.includes(member.uuid)) {
                        this.memberList.push(member.uuid)
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
            /* console.log('No document named ToC inside the collection.') */
          }
          this.gettingCount()
        })
        .then(() => {
          this.db.collection('users').doc('ToC').get()
            .then(doc => {
              if (doc.exists) {
                this.userToC = doc.data()
              } else {
                // console.log('No ToC!')
              }

              this.loading = false
            })
            .catch(err => {
              if (err) {
                // console.log(err)
              }
            })
        })
        .catch(error => {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    loadInformation: function () {
      // load the minimun database information to the respective component var

      return this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            let data = doc.data()

            // extracting keywords for the banner and dropdown filter
            // non-sorted to maintain order for now
            // let cachedKeywords = data.projectsConfig.keywords.sort()
            // let cachedKeywords = data.projectsConfig.keywords

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
            this.keywordsInUse = data.projectsConfig.keywords

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

            this.todayDate = new Date(Date.now() - data.newFlag * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
          }
        })
    },
    gettingCount: function () {
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
/* Colors from: https://www.december.com/html/spec/color2.html */
.full-color {
  background-image: linear-gradient(#00EE00, #9AFF9A, #00EE00)
}

/* Colors from: https://www.december.com/html/spec/color1.html */
.half-full-color {
  background-image: linear-gradient(#FFE600, #FFF68F, #FFE600)
}

/* Colors from: https://www.december.com/html/spec/color0.html */
.null-color {
  background-image: linear-gradient(#E0E0E0, #F5F5F5, #E0E0E0)
}
</style>
