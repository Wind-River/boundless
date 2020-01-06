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

Name:     pages/AdminPage.vue
Purpose:  Provide graphical user interface for the admin to manage application
Methods:
  * Provide general settings interface for the admin
  * Provide user settings interface for the admin
  * Provide project settings interface for the admin
  * Provide challange settings interface for the admin

## -->

<template>
  <!-- -------------------- Error 404 -------------------- -->
  <NotFound v-if="notFound" />

  <!-- -------------------- Admin Page Content -------------------- -->
  <q-page v-else class="q-pa-sm q-mt-md">
    <q-card class="q-pa-md console-page">
      <!-- -------------------- Page Header -------------------- -->
      <div>
        <p align="center" style="font-size: 18px;" >
          <strong>Admin Console</strong>
        </p>
        <q-separator class="q-mb-sm" color="secondary" />
      </div>

      <!-- -------------------- Content Tabs -------------------- -->
      <div>
        <q-tabs
          dense inline-label
          class="text-grey" align="justify"
          active-color="primary" indicator-color="primary"
          v-model="parentOption"
        >
          <q-tab
            no-caps
            name="projects" label="Projects" icon="fas fa-tasks"
          />
          <q-tab
            v-if="layoutConfig && layoutConfig.challenges"
            no-caps
            name="challenges" label="Challenges" icon="fas fa-flag"
          />
          <q-tab
            no-caps
            name="users" label="Users" icon="person"
          />
          <q-tab
            no-caps
            name="systems" label="Settings" icon="settings"
          />
        </q-tabs>

        <!-- -------------------- Tab Content -------------------- -->
        <q-tab-panels
          v-model="parentOption"
          keep-alive animated
          transition-next="fade" transition-prev="fade"
        >
          <!-- -------------------- Project Tab Content -------------------- -->
          <q-tab-panel name="projects">
            <div class="q-pa-xs console-content-tab">
              <ManageProjects />
            </div>
          </q-tab-panel>

          <!-- ------------------- Challenge Tab Content ------------------- -->
          <q-tab-panel
            v-if="layoutConfig && layoutConfig.challenges" name="challenges"
          >
            <div class="q-pa-xs console-content-tab">
              <ManageChallenges />
            </div>
          </q-tab-panel>

          <!-- -------------------- Users Tab Content -------------------- -->
          <q-tab-panel name="users">
            <div class="q-pa-xs console-content-tab">
              <ManageUsers />
            </div>
          </q-tab-panel>

          <!-- ------------------- Settings Tab Content -------------------- -->
          <q-tab-panel name="systems">
            <q-splitter
              disable
              class="shadow-2 console-content-tab"
              v-model="splitterModel"
            >
              <template v-slot:before>
                <q-tabs
                  vertical inline-label stretch
                  class="text-primary"
                  v-model="optionTab"
                >
                  <q-tab
                    no-caps
                    name="general" icon="bubble_chart" label="General"
                  />

                  <q-separator />

                  <q-tab
                    no-caps
                    name="database" icon="storage" label="Database"
                  />

                  <q-separator />

                  <q-tab
                    v-if="layoutConfig && layoutConfig.challenges"
                    no-caps
                    name="challenges" icon="fas fa-mountain" label="Challenges"
                  />

                  <q-separator />

                  <q-tab
                    no-caps
                    name="projects" icon="list_alt" label="Projects"
                  />

                  <q-separator />

                  <q-tab
                    no-caps
                    name="users" icon="person" label="Users"
                  />

                  <q-separator />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels v-model="optionTab">
                  <!-- ---------- Managing Data from Database ---------- -->
                  <q-tab-panel name="database">
                    <div class="text-h4 q-mb-md">
                      Database
                      <q-separator color="secondary" />
                    </div>

                    <div>
                      <q-card class="q-ml-sm q-mr-sm q-mt-sm q-pa-sm">
                        <q-btn-toggle
                          push glossy no-caps
                          toggle-color="primary"
                          :options="[
                            {label: 'Primary', value: 'production'},
                            {label: 'Test', value: 'testing'}
                          ]"
                          v-model="db"
                          @input="switchDatabase"
                        />
                      </q-card>

                      <ManageDatabase
                        @importingToDB="consoleLoading"
                      />
                    </div>
                  </q-tab-panel>

                  <!-- ---------------- Challenge Settings ----------------- -->
                  <q-tab-panel name="challenges">
                    <div v-if="configs.challenges">
                      <SettingsConfigPanel
                        :keywords="configs.keywords"
                        :type="'challenges'"
                        :configs="configs.challenges"
                        :ratio="previewRatio"
                        @submitting="consoleLoading"
                        @submitted="getChallengeConfig"
                      />
                    </div>
                  </q-tab-panel>

                  <!-- ----------------- Project Settings ------------------ -->
                  <q-tab-panel name="projects">
                    <div v-if="configs.projects">
                      <SettingsConfigPanel
                        :keywords="configs.keywords"
                        :type="'projects'"
                        :configs="configs.projects"
                        :ratio="previewRatio"
                        @submitting="consoleLoading"
                        @submitted="getProjectConfig"
                      />
                    </div>
                  </q-tab-panel>

                  <!-- ------------------- User Settings ------------------- -->
                  <q-tab-panel name="users">
                    <div v-if="configs.users">
                      <div class="text-h4 q-mb-md">
                        Users
                        <q-separator color="secondary" />
                      </div>

                      <div>
                        <div v-if="configs.users.socialNetwork !== undefined" class="q-pa-lg" >
                          <q-option-group
                            inline
                            color="primary" type="checkbox"
                            :options="configs.users.socialNetwork.list"
                            v-model="configs.users.socialNetwork.use"
                          />

                          <q-btn no-caps color="secondary" label="Submit" />
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>

                  <!-- ------------------ System Settings ------------------ -->
                  <q-tab-panel name="general">
                    <div class="text-h4 q-mb-md">
                      General {{
                        $q.sessionStorage.has('boundless_config')
                        ? ($q.sessionStorage.getItem(
                          'boundless_config'
                        ).config_version
                        ? `(v ${$q.sessionStorage.getItem(
                          'boundless_config'
                        ).config_version})` : '')
                        : ''
                      }}
                      <q-separator color="secondary" />
                    </div>

                    <div>
                      <SystemSettings
                        @usersConfigInfo="getUserConfig"
                        @challengesConfigInfo="getChallengeConfig"
                        @projectsConfigInfo="getProjectConfig"
                        @keywords="getKeywords"
                        @submitting="consoleLoading"
                      />
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>

            </q-splitter>
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <q-inner-loading :showing="haltConsole">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
import { layoutConfig } from '../../boundless.config'

import ManageProjects from '../components/ManageProject'
import ManageChallenges from '../components/ManageChallenge'
import ManageUsers from '../components/ManageUser'

import SystemSettings from '../components/SystemSettings'
import ManageDatabase from '../components/GetDataFromFirestore'
import SettingsConfigPanel from '../components/SettingPanels/Config'

import NotFound from './Error404'

export default {
  components: {
    ManageProjects,
    ManageChallenges,
    ManageUsers,
    SystemSettings,
    ManageDatabase,
    SettingsConfigPanel,
    NotFound
  },
  created () {
    // TODO: handle inside routes
    if (this.$q.sessionStorage.has('admin_token')) {
      this.notFound = false
    } else {
      this.notFound = true
    }

    if (this.notFound) {
      setTimeout(() => {
        this.$router.replace('/')
      }, 1500)
    } else {
      if (this.$q.localStorage.has('boundless_db')) {
        this.db = this.$q.localStorage.getItem('boundless_db')
      }

      if (this.$q.sessionStorage.getItem('boundless_config')) {
        let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
        this.layoutConfig = layoutConfig

        if (typeof cachedConfig.enabledChallenges === 'boolean') {
          this.layoutConfig.challenges = cachedConfig.enabledChallenges
        }
      } else {
        this.layoutConfig = layoutConfig
      }
    }
  },
  data () {
    return {
      // TODO: add quick succint explanation
      layoutConfig: null, // <Object>: dictionary of layout values
      optionTab: 'general', // <String>
      splitterModel: 15, // <Number>
      notFound: false, // <Boolean>
      db: null, // <String>: name of the database
      parentOption: 'projects', // <String>
      previewRatio: '5', // <String>
      configs: { // <Object<Object>>
        users: {},
        projects: {},
        challenges: {},
        keywords: {}
      },
      haltConsole: false // <Boolean>
    }
  },
  methods: {
    consoleLoading: function (loadVal) {
      // handle page loading via child event
      // params:
      //   @loadVal <Boolean>: event emitter value to render loading

      this.haltConsole = loadVal
    },
    getKeywords: function (val) {
      // load keywords from the child component and convert to
      // map to assign as one of the object inside this.configs var
      // params:
      //   @val <Object>: event emitter value containing keywords from database

      if (val) {
        this.configs.keywords = {}
        for (let key in val) {
          this.configs.keywords[key] = val[key]
        }
      }
    },
    getProjectConfig: function (val) {
      // load project configuartion from the child component and
      // assign as one of the object inside this.configs var
      // params:
      //   @val <Object>: event emitter value containing database information

      if (val) {
        this.configs.projects = val
      }
    },
    getChallengeConfig: function (val) {
      // load challenge configuartion from the child component and
      // assign as one of the object inside this.configs var
      // params:
      //   @val <Object>: event emitter value containing database information

      if (val) {
        this.configs.challenges = val
      }
    },
    getUserConfig: function (val) {
      // load user configuartion from the child component and assign
      // as one of the object inside this.configs var
      // params:
      //   @val <Object>: event emitter value contating database information

      if (val) {
        val.list = val.list.sort(
          (a, b) => a.value < b.value ? -1 : 1
        )

        this.configs.users.socialNetwork = val
      }
    },
    switchDatabase: function () {
      // switch database namespace

      this.$q.localStorage.set('boundless_db', this.db)
      if (this.$q.sessionStorage.has('boundless_timeout')) {
        this.$q.sessionStorage.remove('boundless_timeout')
        this.$q.sessionStorage.remove('boundless_config')
      }
      this.$router.go()
    }
  }
}
</script>

<style lang="stylus">
// console-page page loadout
.console-page {
  min-width: 800px;
  max-width: 98%;
  margin: auto;
  max-height: 78vh;
  overflow: hidden;
}

// left-tab loadout
.console-content-tab {
  height: 60vh;
  overflow: auto;
  border-radius: 3px;
}
</style>
