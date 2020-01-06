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
  <!-- -------------------- Error 404 -------------------- -->
  <NotFound v-if="notFound" />

  <!-- -------------------- Data Manipulation -------------------- -->
  <div v-else class="q-pa-sm q-mt-md">
    <q-card
      class="q-pa-md"
      style="min-width: 800px; max-width: 50%; margin: auto;"
    >
      <q-form @submit="onSubmit">
        <!-- <div v-if="curData.toc">
          <q-card
            v-for="(val, key, ind) in curData.toc.users"
            :key="ind"
            class="q-pa-md q-mb-md"
          >
            {{ key }}
            <li
              v-for="(v, k, i) in val"
              :key="i"
            >
              {{ k }}: {{ v }}
            </li>
          </q-card>
        </div> -->
        <!-- <div v-if="curData.toc">
          <q-card
            v-for="(val, key, ind) in curData.toc.projects"
            :key="ind"
            class="q-pa-md q-mb-md"
          >
            {{ key }}
            <li
              v-for="(v, k, i) in val"
              :key="i"
            >
              {{ k }}: {{ v }}
            </li>
          </q-card>
        </div> -->
        <!-- <div v-if="curData.toc">
          <q-card
            v-for="(val, key, ind) in curData.toc.challenges"
            :key="ind"
            class="q-pa-md q-mb-md"
          >
            {{ key }}
            <li
              v-for="(v, k, i) in val"
              :key="i"
            >
              {{ k }}: {{ v }}
            </li>
          </q-card>
        </div> -->

        <q-btn
          :disable="submitReady"
          color="secondary"
          class="full-width"
          label="Restructure"
          @click="fixRecord"
        />
        <q-btn
          :disable="!submitReady"
          no-caps
          color="secondary"
          class="full-width"
          type="submit" label="Insert"
        />
      </q-form>
    </q-card>
  </div>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import NotFound from './Error404'

export default {
  name: 'Adding_Data',
  components: {
    NotFound
  },
  created () {
    if (this.$q.sessionStorage.has('admin_token')) {
      this.notFound = false
    } else {
      this.notFound = true
    }

    if (this.notFound) {
      setTimeout(() => {
        this.$router.replace('/')
      }, 250)
    } else {
      this.getDb().then(res => {
        this.getData()
      })
    }
  },
  data () {
    return {
      db: null,
      submitReady: false,
      data: {
        files: [],
        toc: {}
      },
      curData: {},
      dataCollections: [
        'projects',
        'users',
        'challenges'
      ]
    }
  },
  methods: {
    fixRecord: function () {
      this.fixUsersRecord()
      this.fixProjectsRecord()
      this.fixChallengesRecord()

      this.submitReady = true
    },
    fixUsersRecord: function () {
      let user
      for (let uuid in this.curData.toc.users) {
        user = this.curData.toc.users[uuid]

        // user.email = user.email
        // user.name = user.name
        // user.timestamp = user.timestamp
        user.created = user.created || user.timestamp
        user.imgURL = user.imgURL || ''
        user.title = user.title || ''
        user.uuid = user.uuid || user.email
      }
      // console.log(this.curData.toc.users)
      this.$forceUpdate()
    },
    fixProjectsRecord: function () {
      let project
      for (let uuid in this.curData.toc.projects) {
        if (uuid !== 'alias') {
          project = this.curData.toc.projects[uuid]

          // project.uuid = project.uuid
          // project.project = project.project
          // project.description = project.description
          // project.keywords = project.keywords
          // project.timestamp = project.timestamp
          // project.progress = project.progress
          project.created = project.created || project.timestamp
          project.hidden = project.hidden || false
          project.alias = project.alias || ''

          if (project.members[0].email) {
            // update the members
            let tmpMembers = []
            project.members.forEach(member => {
              tmpMembers.push({
                uuid: member.email,
                role: member.role
              })
            })

            project.members = tmpMembers
          } else {
            // do nothing
          }

          delete project.log
        }
      }
      // console.log(this.curData.toc.projects)
      this.$forceUpdate()
    },
    fixChallengesRecord: function () {
      let challenge
      for (let uuid in this.curData.toc.challenges) {
        if (uuid !== 'alias') {
          challenge = this.curData.toc.challenges[uuid]

          challenge.alias = challenge.alias || ''
          // challenge.challenge = challenge.challenge
          challenge.created = challenge.timestamp || challenge.created
          // challenge.description = challenge.description
          challenge.hidden = challenge.hidden || false
          challenge.keywords = challenge.keywords || []
          challenge.priority = challenge.priority || 2
          challenge.projects = challenge.projects || []
          challenge.rationale = challenge.rationale || ''
          // challenge.timestamp = challenge.timestamp
          // challenge.uuid = challenge.uuid

          // challenge.sponsors: tmpMembers
          if (challenge.sponsors[0].email) {
            // update the sponsors
            let tmpMembers = []
            challenge.sponsors.forEach(member => {
              tmpMembers.push({
                uuid: member.email
              })
            })

            challenge.sponsors = tmpMembers
          } else {
            // do nothing
          }
        }
      }
      // console.log(this.curData.toc.challenges)
      this.$forceUpdate()
    },
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
    onSubmit: function () {
      // this.curData.files.forEach(file => {
      //   file.data.webpage.body.forEach(webContent => {
      //     webContent.content['hidden'] = false
      //   })

      //   this.db.collection('test').doc(file.id).set(file.data)
      // })
      // TODO
      this.db.collection('test').doc('ToC').set(this.curData.toc)
    },
    getData: function () {
      this.dataCollections.forEach(collection => {
        this.db.collection(collection).get()
          .then(docs => {
            docs.forEach(doc => {
              if (doc.exists) {
                if (doc.id === 'ToC') {
                  this.data.toc[collection] = doc.data()
                } else if (doc.id === 'alias') {
                  // do nothing
                } else {
                  this.data.files.push({
                    id: doc.id,
                    data: doc.data()
                  })
                }
              }
            })

            if (collection === this.dataCollections[this.dataCollections.length - 1]) {
              this.curData = this.deepObjCopy(this.data)
              this.data = {}
            }
          })
          .catch(err => {
            if (err) {
              /* console.log(err) */
            }
          })
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

<style>

</style>
