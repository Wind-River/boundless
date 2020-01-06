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
## -->

<template>
  <q-page class="q-pa-lg" style="min-width: 620px;">
    <!-- -------------------- Page Loader -------------------- -->
    <div v-if="loading" class="absolute-center">
      <q-spinner color="primary" size="8em" />
    </div>

    <div v-else>
      <!-- -------------------- Project Display Table -------------------- -->
      <q-table
        class="my-sticky-header-table"
        :data="childProjectList"
        :columns="columns"
        row-key="project"
        :filter="filter"
        :loading="loading"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right>

          <q-toolbar>
            <q-btn
              dense flat round
              class="q-mr-xs" icon="menu"
            >
              <q-menu dense>
                <q-list
                  v-for="(keyword, index) in childKeywords"
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
              color="primary"
              v-model="filter"
              placeholder="keyword search"
              style="min-width: 400px;"
            >
              <template v-slot:append>
                <q-icon v-if="filter === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
              </template>
            </q-input>
          </q-toolbar>
        </template>

        <template v-slot:body="props" >
          <q-tr :props="props">

            <q-td
              key="new"
              :props="props"
              style="width: 95px;"
            >
              <q-icon
                v-if="todayDate <= props.row.timestamp.substring(0, 10)"
                name="fiber_new"
                color="accent"
                size="2.5em"
              />
              <div hidden>
                {{ joinKeywords(props.row.keywords) }}
              </div>
            </q-td>

            <q-td key="project" :props="props">
              <div align="left">
                <q-btn
                  v-if="tableMode === 'edit'"
                  dense round color="accent"
                  size="sm" icon="delete" class="q-mr-xs"
                  @click="deleteProject(props.row.project)"
                />
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
                @click="displayProjectPage(props.row.uuid)"
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
export default {
  name: 'Project_table',
  components: {
  },
  props: {
    userId: String, // used by EditUser
    childDb: Object, // used by ViewChallenge
    tableMode: String, // used by AdminConsole
    viewProjectList: Array, // used by ViewChallenge
    projectList: Array // used by AdminConsole
  },
  created () {
    if (this.userId) {
      this.getUserProjectList()
    } else {
      if (this.viewProjectList) {
        this.getChildProjectList()
      } else {
        this.refactorProjectList()
      }
      this.getConfig()
    }
  },
  data () {
    return {
      childProjectList: [],
      childKeywords: [],
      todayDate: '',
      rowMessage: '',
      fixedDialog: false,
      filter: '',
      loading: true,
      pagination: {
        sortBy: 'new',
        rowsPerPage: 50
      },
      columns: [
        {
          name: 'new',
          label: 'New',
          field: row => row.timestamp,
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
    getUserProjectList: function () {
      // this code is temporary since the data will morph
      this.childDb.collection('projects').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            for (let project in doc.data()) {
              if (project !== 'alias') {
                doc.data()[project].members.forEach(member => {
                  if (member.email === this.userId) {
                    this.childProjectList.push(doc.data()[project])
                  }
                })
              }
            }
          } else {
            /* console.log('No document named ToC inside the collection.') */
          }
        })
        .then(() => {
          this.loading = false
        })
        .catch(err => {
          if (err) {
            /* console.log(err) */
          }
        })
    },
    getChildProjectList: function () {
      this.childDb.collection('projects').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            this.viewProjectList.forEach(uid => {
              this.childProjectList.push(doc.data()[uid])
            })
          } else {
            /* console.log('No document named ToC inside the collection.') */
          }
        })
        .then(() => {
          this.loading = false
        })
        .catch(error => {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    getConfig: function () {
      this.childDb.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            let data = doc.data()

            for (let key in data['keywords']) {
              this.childKeywords.push({
                label: key,
                value: data['keywords'][key]
              })
            }

            if (typeof data['pagination'] === 'number') {
              this.pagination.rowsPerPage = data['pagination']
            }

            this.todayDate = new Date(Date.now() - data.newFlag * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
          }
        })
    },
    deleteProject: function (entry) {
      this.$emit('deleted', entry)
    },
    refactorProjectList: function () {
      let tmpList = []
      if (this.projectList) {
        this.projectList.forEach(project => {
          tmpList.push(project.value)
        })
      }

      this.childProjectList = tmpList

      this.loading = false
    },
    displayProjectPage: function (entry) {
      let routeData = this.$router.resolve('project/' + entry, '/')
      window.open(routeData.href, '_blank')
    },
    displayMembers: function (entry) {
      let retMembers = ''
      entry.forEach(member => {
        if (member.role === 'lead') {
          retMembers += ', ' + member.name
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
    columnsFont: function () {
      this.columns.forEach(entry => {
        entry.style = {
          fontSize: '18px'
        }
      })
    }
  },
  watch: {
    projectList: 'refactorProjectList'
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

.title-font-1 {
  font-size: 18px;
  color: #C00000;
}
</style>
