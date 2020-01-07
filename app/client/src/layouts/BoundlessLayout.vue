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

Name:     layouts/BoundlessLayout.vue
Purpose:  Define the standard layout of the application on every page.
          For example, menus, logos, and navigation bar borders.
Methods:
  * Define navigation menu
  * Admin log in/out
  * Header/Footer

## -->

<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="routeHomeURL" >
          <div class="row">
            <q-toolbar class="col">
              <q-icon class="q-mr-sm" name="home" />

              <span v-if="layoutConfig && layoutConfig.homeName">
                Home ({{ layoutConfig.homeName }})
              </span>

              <span v-else>
                Home
              </span>
            </q-toolbar>

            <q-toolbar
              v-if="
                $q.localStorage.has('boundless_db') &&
                $q.localStorage.getItem('boundless_db') === 'testing'
              "
              class="col-2"
            >
              <q-space/>

              <q-img
                contain
                src="../statics/images/testing-db-icon.png"
                :ratio="4/1"
              />

              <q-space/>
            </q-toolbar>
          </div>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs
        no-caps
        class="text-secondary shadow-1"
        align="left" style="background: #F5F5F5;"
      >
        <q-route-tab to="/" label="About" />

        <q-route-tab to="/project/display" label="Projects" />

        <q-route-tab to="/project/add" label="Submit Project" />

        <q-route-tab
          v-if="layoutConfig && layoutConfig.challenges"
          to="/challenge/display" label="Challenges"
        />

        <q-route-tab
          v-if="layoutConfig && layoutConfig.challenges"
          to="/challenge/add" label="Submit Challenge"
        />

        <q-route-tab
          v-if="layoutConfig && layoutConfig.hairCut"
          to="/haircut" icon="fas fa-cut"
        />

        <q-route-tab
          v-if="$q.sessionStorage.has('admin_token')"
          to="/admin/console" icon="widgets"
        />

        <q-space />

        <q-tab
          :label="$q.sessionStorage.has('admin_token') ? 'Log Out' : 'Log In'"
          @click="logInLogOut"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row">
            <q-toolbar
              v-if="layoutConfig && layoutConfig.companyName"
              class="col"
            >
              Boundless Innovation @ {{ layoutConfig.companyName }}
            </q-toolbar>

            <q-toolbar v-else class="col">
              Boundless Innovation
            </q-toolbar>

            <q-toolbar
              v-if="
                $q.localStorage.has('boundless_db') &&
                $q.localStorage.getItem('boundless_db') === 'testing'
              "
              class="col-2"
            >
              <q-space/>
                <q-img
                  contain
                  src="../statics/images/testing-db-icon.png"
                  :ratio="4/1"
                />
              <q-space/>
            </q-toolbar>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import sha256 from 'sha256'

import {
  layoutConfig, configMeta, dbMeta, configSkeleton
} from '../../boundless.config'

export default {
  created () {
    // cookie manager to maintain log in sessions
    this.cookieCheck()

    // setting window var to login on focus
    // TODO: explain more
    window.onfocus = this.cookieCheck

    // loading required data from the database
    this.loadFireRefs().then(() => {
      // TODO: short description
      if (
        !this.$q.sessionStorage.has('boundless_config') ||
        this.$q.sessionStorage.getItem('boundless_timeout') < Date.now()
      ) {
        this.loadConfig()
      }
      // TODO: chain with else
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
  beforeUpdate () {
    // fetch loadConfig once per every 5 mins
    if (this.$q.sessionStorage.getItem('boundless_timeout') < Date.now()) {
      this.loadConfig()
    }
  },
  data () {
    return {
      // TODO: describe their functions inside the vue component
      db: null,
      layoutConfig: null
    }
  },
  methods: {
    loadFireRefs: function () {
      // load firebase database reference
      // load firebase storage reference (if applicable)
      // load firebase cloud functions reference (if applicable)
      // return: Promise<String>
      if (this.$q.localStorage.has('boundless_db')) {
        // TODO: add description
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
        // loading the firebase references from the database and save
        // into cache for later usages
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
                reject('"/config/project" path does not exists in the database...(BoundlessLayout)')
              }
            })
        }).catch(err => {
          if (err) {
            this.db = productionDb
            this.$q.localStorage.set('boundless_db', 'production')
          }
        })
      }
    },
    loadConfig: function () {
      // TODO: have a cache delay param
      // load db_configurations
      // try to update db if db_version mismatch occurs
      return this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            // checking for config_version
            if (
              !doc.data().config_version ||
              doc.data().config_version < configMeta.config_version
            ) {
              // deepClone before updating db_config
              let tempData = this.deepObjCopy(doc.data())

              // let oldVersion = tempData.config_version || '0.0.0.0'

              // TODO: work on appending the list of updates
              tempData.config_version = configMeta.config_version

              let key = configMeta.config_version.split('.').join('_')

              configMeta[`ver${key}`].forEach(updateEle => {
                if (updateEle.action === 'CREATE') {
                  // creation will always be at root and root is obj
                  for (let newProp in updateEle.data) {
                    tempData[newProp] = updateEle.data[newProp]
                  }
                } else if (updateEle.action === 'ADD') {
                  if (
                    updateEle.field === 'challengesConfig' ||
                    updateEle.field === 'projectsConfig'
                  ) {
                    tempData[updateEle.field] = {
                      listingTable: {
                        bannerImg: {
                          active: false,
                          url: ''
                        }
                      },
                      webpage: {
                        bannerImg: {
                          active: false,
                          url: ''
                        },
                        mainImg: {
                          active: false,
                          url: ''
                        }
                      }
                    }
                  }

                  if (updateEle.type === 'OBJECT') {
                    for (let newProp in updateEle.data) {
                      // for now field is only 1 lvl deep
                      tempData[updateEle.field][newProp] = updateEle.data[newProp]
                    }
                  } else if (updateEle.type === 'ARRAY') {
                    updateEle.data.forEach(entry => {
                      tempData[updateEle.field].push(entry)
                    })
                  }
                } else if (updateEle.action === 'DELETE') {
                  // TODO:
                }
              })

              this.db.collection('config').doc('project')
                .set(tempData, { merge: true })

              this.$q.sessionStorage.set('boundless_config', tempData)
              this.$q.sessionStorage.set(
                'boundless_timeout', Date.now() + 5 * 60 * 1000
              )
            } else {
              this.$q.sessionStorage.set('boundless_config', doc.data())
              this.$q.sessionStorage.set(
                'boundless_timeout', Date.now() + 5 * 60 * 1000
              )
            }
          }
        })
        .catch(err => {
          if (err) {
          }
        })
    },
    deepObjCopy: function (aObject) {
      // https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript/34624648#34624648
      // NOTE: DOES NOT WORK WITH CYCLICAL OBJECTS SUCH AS REQUEST, RESPOND AND ETC.
      // return: Object
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
    },
    routeHomeURL: function () {
      // route to homeURL
      // if specified inside the boundless config file
      // else route back to 'About Page'
      if (this.layoutConfig.homeURL) {
        window.open(this.layoutConfig.homeURL)
      } else {
        this.$router.push({ path: '/' }).catch(err => {
          if (err) {
            // error
          }
        })
      }
    },
    logInLogOut: function () {
      if (this.$q.sessionStorage.has('admin_token')) {
        this.$q.sessionStorage.remove('admin_token')
        this.$q.cookies.remove('userToken')

        this.$router.replace('/').catch(err => {
          if (err) {
          }
        })
      } else {
        this.logInDialog()
      }

      this.$forceUpdate()
    },
    logInDialog: function () {
      // TODO: build an actual dialog component later
      this.$q.dialog({
        title: 'Admin Log In',
        message: 'Admin Username:',
        prompt: {
          model: '',
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        if (data === dbMeta.admin.username) {
          this.$q.dialog({
            title: 'Admin Log In',
            message: 'Password:',
            prompt: {
              dense: true,
              model: '',
              type: 'password'
            },
            cancel: true,
            persistent: true
          }).onOk(data => {
            this.db.collection('--db_meta--').doc('data').get()
              .then(doc => {
                if (doc.exists) {
                  let docData = doc.data()
                  let correctPass = false
                  let shaPass = sha256(data)

                  // if the admin field is not there initially
                  if (!docData.admin) {
                    // update db_meta
                    this.db.collection('--db_meta--').doc('data').set({
                      admin: dbMeta.admin
                    }, { merge: true })

                    correctPass = shaPass === dbMeta.admin.password
                  } else { // if the admin field is already there
                    correctPass = shaPass === docData.admin.password
                  }

                  if (correctPass) {
                    this.$q.sessionStorage.set('admin_token', 'admin')
                    this.$q.cookies.set(
                      'userToken', 'admin', { sameSite: 'Strict' }
                    )

                    this.$router.go()
                  } else {
                    setTimeout(() => {
                      alert('Unsucessful log in!')
                    }, 300)
                  }
                } else {
                  // TODO: promise.all
                  this.db.collection('--db_meta--').doc('data').set(dbMeta)
                  this.db.collection('config').doc('project')
                    .set(configSkeleton)

                  let correctPass = false
                  let shaPass = sha256(data)

                  correctPass = shaPass === dbMeta.admin.password

                  if (correctPass) {
                    this.$q.sessionStorage.set('admin_token', 'admin')
                    this.$q.cookies.set(
                      'userToken', 'admin', { sameSite: 'Strict' }
                    )

                    this.$router.go()
                  } else {
                    setTimeout(() => {
                      alert('Unsucessful log in!')
                    }, 300)
                  }
                }
              })
          })
        } else {
          setTimeout(() => {
            alert('User does not exists!')
          }, 300)
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    cookieCheck: function () {
      // check sessionStorage and cookies for login information
      // TODO: more description on what it does with the information
      if (
        this.db &&
        this.$q.sessionStorage.getItem('boundless_timeout') < Date.now()
      ) {
        this.loadConfig()
      }

      if (
        this.$q.cookies.has('userToken') &&
        this.$q.cookies.get('userToken') === dbMeta.admin.username
      ) {
        if (!this.$q.sessionStorage.has('admin_token')) {
          this.$q.sessionStorage.set('admin_token', 'admin')

          this.$router.go()
        }
      } else {
        if (this.$q.sessionStorage.has('admin_token')) {
          this.$q.sessionStorage.remove('admin_token')
          this.$router.go()
        }
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
