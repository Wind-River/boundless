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

Name:     components/ManageChallenge.vue
Purpose:
Methods:
  *

## -->

<template>
  <q-card class="q-pa-lg">

    <!-- -------------------- Main Content -------------------- -->
    <q-table
      wrap-cells
      color="secondary"
      :data="projectList"
      :columns="columns"
      row-key="uuid"
      :filter="filter"
      :loading="loading"
      :pagination.sync="pagination"
    >
      <template v-slot:top-left>
        <q-btn
          round
          icon="add" color="secondary"
          @click="dialog = true; dialogOption = 'add'"
        />
      </template>

      <template v-slot:top-right>
        <q-toolbar>
          <q-btn
            dense flat round
            icon="menu"
            class="q-mr-xs"
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
            debounce="300" color="primary" placeholder="Search"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon
                v-if="filter === ''"
                name="search"
              />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="filter = ''"
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

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td
            key="keywords"
            :props="props"
          >
            <div
              hidden
              align="left"
            >
              {{ props.row.keywords }}
            </div>
          </q-td>

          <q-td
            key="name"
            :props="props"
            style="width: 300px;"
          >
            <div align="left">
              {{ props.row.challenge }}
            </div>
          </q-td>

          <q-td
            key="alias"
            :props="props"
          >
            <div align="left">
              {{ props.row.alias }}
            </div>
          </q-td>

          <q-td
            key="uuid"
            :props="props"
          >
            <div align="center">
              {{ props.row.uuid }}
            </div>
          </q-td>

          <q-td
            key="icons"
            :props="props"
            style="width: 100px;"
          >
            <q-btn
              dense round flat
              color="secondary" icon="edit"
              @click="editProject(props.row.uuid)"
            />

            <q-btn
              dense round flat
              color="secondary" icon="delete"
              @click="deleteChallenge(props.row.uuid, props.row.alias)"
            />
          </q-td>

        </q-tr>
      </template>

    </q-table>

    <q-dialog
      persistent maximized
      transition-show="slide-up" transition-hide="slide-down"
      v-model="dialog"
    >
      <q-card>

        <q-card-section
          v-if="dialogOption === 'add'"
        >
          <addChallenge
            @added="updateProjectsAndClose"
            @close="dialog = false"
          />
        </q-card-section>

        <q-card-section
          v-if="dialogOption === 'edit'"
        >
          <br>
          <popUpChallenge
            :challengeId="uuid"
            :mode="dialogOption"
            @added="updateProjects"
            @close="dialog = false"
          />
        </q-card-section>

      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import productionDb, { proAppCall } from '../firebase/init_production'
import testingDb, { testAppCall } from '../firebase/init_testing'

import addChallenge from '../components/SubmitChallengeAdminConsole'
import popUpChallenge from '../components/EditAndPreviewChallenge'

export default {
  components: {
    addChallenge,
    popUpChallenge
  },
  created () {
    this.loadFireRefs().then(res => {
      this.getProjects()
      this.getConfig()
      // this.columnsFont()
    })
  },
  data () {
    return {
      db: null,
      cloudFunctions: null,
      uuid: '',
      popkeywords: [],
      dialog: false,
      dialogOption: '',
      projectList: [],
      uuidList: [],
      filter: '',
      loading: true,
      pagination: {
        rowsPerPage: 5
      },
      columns: [
        {
          name: 'keywords',
          label: '',
          field: row => row.keywords
        },
        {
          name: 'name',
          required: true,
          align: 'center',
          label: 'Challenge Name',
          field: row => row.challenge,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'alias',
          required: true,
          align: 'center',
          label: 'Alias',
          field: row => row.alias || '',
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'uuid',
          required: true,
          label: 'UUID',
          align: 'center',
          field: row => row.uuid,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'icons',
          align: 'center',
          label: ''
        }
      ]
    }
  },
  methods: {
    loadFireRefs: function () {
      if (this.$q.localStorage.has('boundless_db')) {
        let sessionDb = this.$q.localStorage.getItem('boundless_db')
        return new Promise((resolve, reject) => {
          if (sessionDb === 'testing') {
            this.db = testingDb
            this.cloudFunctions = testAppCall.httpsCallable('appCall')
          } else {
            this.db = productionDb
            this.cloudFunctions = proAppCall.httpsCallable('appCall')
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
    submitEnter: function (entry) {
      let refName = `popup${entry}`
      this.$refs[refName].set()
      // push to database
    },
    getConfig: function () {
      this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            var data = doc.data()

            for (var key in data['keywords']) {
              this.popkeywords.push({
                label: key,
                value: data['keywords'][key]
              })
            }
          }
        })
    },
    getProjects: function () {
      this.db.collection('challenges').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            let tocProjectData = doc.data()
            for (let project in tocProjectData) {
              if (project !== 'alias') {
                this.projectList.push(tocProjectData[project])
                this.uuidList.push(project)
              }
            }
          } else {
            /* console.log('No -ToC- document!') */
          }

          setTimeout(() => {
            this.loading = false
          }, 500)
        })
        .catch(error => {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    deleteChallenge: function (entry, removedAlias) {
      this.$q.dialog({
        title: 'Confirmation to Delete',
        message: `Delete ${entry}?`,
        ok: true,
        cancel: true
      })
        .onOk(() => {
          if (this.projectList.length < 1) {
            this.$q.dialog({
              title: 'Error',
              message: 'Nothing to remove!'
            })
          } else {
            if (this.uuidList.includes(entry)) {
              this.db.collection('challenges').doc(entry).delete()
                .then(() => {
                  this.$q.notify({
                    icon: 'done',
                    color: 'positive',
                    message: 'Deleted sucessfully!',
                    closeBtn: 'OK'
                  })
                })
                .catch(error => {
                  if (error) {
                    /* console.log(error) */
                  }
                })

              let updates = {}
              updates[entry] = firebase.firestore.FieldValue.delete()

              if (typeof removedAlias !== 'undefined') {
                if (removedAlias !== '') {
                  updates[`alias.${removedAlias}`] = firebase.firestore.FieldValue.delete()
                }
              }

              this.db.collection('challenges').doc('ToC').update(updates)

              let tmpProjectList = []

              this.projectList.forEach(project => {
                if (project.uuid !== entry) {
                  tmpProjectList.push(project)
                }
              })

              this.projectList = tmpProjectList

              // delete the storage dir from the storage
              this.cloudFunctions({ folder: `challenges/${entry}` })
            } else {
              this.$q.dialog({
                title: 'Error',
                message: 'UUID does not exist in the database.'
              })
            }
          }
        })
        .onCancel(() => {
        })
    },
    // columnsFont: function () {
    //   this.columns.forEach(entry => {
    //     entry.style = {
    //       fontSize: '18px'
    //     }
    //   })
    // },
    updateProjectsAndClose: function () {
      this.loading = true

      this.projectList = []
      this.uuidList = []

      this.getProjects()

      this.dialog = false
    },
    updateProjects: function () {
      this.loading = true

      this.projectList = []
      this.uuidList = []

      this.getProjects()
    },
    previewProject: function (entry) {
      this.dialogOption = 'preview'
      this.uuid = entry
      setTimeout(() => {
        this.dialog = true
      }, 200)
    },
    editProject: function (entry) {
      this.dialogOption = 'edit'
      this.uuid = entry
      setTimeout(() => {
        this.dialog = true
      }, 200)
    }
  }
}
</script>

<style>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}
</style>
