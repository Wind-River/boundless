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

Name:     pages/SubmitChallenge.vue
Purpose:
Methods:
  *

## -->

<template>
  <div>
    <!-- -------------------- Page Loader -------------------- -->
    <div v-if="loading" class="absolute-center">
      <q-spinner
        color="primary"
        size="8em"
      />
    </div>

    <!-- -------------------- Main Content -------------------- -->
    <q-card
      v-else
      align="center"
      style="margin: auto; max-width: 1000px;"
    >
      <br class="small">
      <h4>New Challenge</h4>

      <q-form
        @submit="onSubmit"
        class="q-pd-md"
        style="max-width: 80%;"
      >

        If you have a problem or challenge you would like others to consider solving  you can post it here.
        <br><br>

        <hr class="newLine2">

        <!-- -------------------- Challenge Name -------------------- -->
        <q-input
          class="q-mt-sm"
          filled
          ref="challengeName"
          v-model="challengeName"
          placeholder="Please enter the name of the challenge..."
          label="Challenge Name"
          lazy-rules
          :rules="[val => !!val || 'Field is required']"
          @keydown.ctrl.shift.65="activateAdmin"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-project-diagram" />
          </template>
        </q-input>

        <!-- -------------------- Challenge Description -------------------- -->
        <q-input
          class="q-mt-sm"
          filled
          autogrow
          ref="challengeDescription"
          v-model="challengeDescription"
          placeholder="Please give 2-5 sentences on what the challenge is about. (Grows automatically.)"
          label="Description/Overview"
          type="textarea"
          lazy-rules
          :rules="[val => !!val || 'Field is required']"
        >
          <template v-slot:prepend>
            <q-icon name="far fa-comment-alt" />
          </template>
        </q-input>

        <!-- ---------------- Challenge Business Rationale ---------------- -->
        <q-input
          class="q-my-sm"
          filled
          autogrow
          ref="challengeRationale"
          v-model="challengeRationale"
          placeholder="Please give 2-5 sentences on why and how this impact the company or the orgnization. (Grows automatically.)"
          label="Business Rationale"
          type="textarea"
        >
          <template v-slot:prepend>
            <q-icon name="device_hub" />
          </template>
        </q-input>

        <hr class="newLine2">

        <!--  -------------------- Keywords -------------------- -->
        <div class="row q-pa-sm" align="left">
          <p class="col-4 header">Keywords:</p>

          <q-option-group
            dense inline
            class="col" type="checkbox"
            v-model="chosenKeywords"
            :options="keywordsOptions"
          />
        </div>

        <hr class="newLine2">

        <!-- -------------------- Sponsors -------------------- -->
        <div>
          <div class="row">
            <p class="col q-pa-sm header" align="left">
              Sponsors:
            </p>
            <span class="col-1 q-mt-sm" >
              <q-btn
                dense round
                color="secondary" icon="add"
                @click="addSponsor"
              />
            </span>
          </div>

          <div
            v-for="(member, index) in sponsors"
            :key="index"
            class="row q-mb-sm"
          >
            <q-input
              filled lazy-rules
              class="col q-mr-xs"
              placeholder="ie. john.doe@gmail.com"
              label="Sponsor's Email" type="email"
              v-model="sponsors[index].email"
              :ref="`memberEmail${index}`"
              :autofocus="index > 0"
              :rules="[val => !!val || 'Field is required']"
              @blur="emailDomainCheck(sponsors[index].email, index)"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input
              :disable="sponsors[index].email in emailToUuidMap"
              filled lazy-rules
              class="col q-mr-xs"
              placeholder="ie. John Doe" label="Contributor's Full Name"
              v-model="sponsors[index].name"
              :ref="`memberName${index}`"
              :rules="[val => !!val || 'Field is required']"
              @blur="capitalizeFirstChar(index)"
            >
              <template v-slot:prepend>
                <q-icon name="group" />
              </template>
            </q-input>

            <!-- <div class="col-1">
              <q-card flat align="center">
                Lead
                <q-toggle
                  color="secondary"
                  v-model="sponsors[index].role"
                  true-value="lead"
                  false-value="member"
                />
              </q-card>
            </div> -->

            <div class="col-1 q-mt-sm">
              <q-btn
                :hidden="index < 1"
                round flat
                icon="delete"
                @click="sponsors.splice(index, 1)"
              />
            </div>
          </div>
        </div>

        <!-- -------------------- Admin Mode -------------------- -->
        <div :hidden="!adminMode">
          <hr class="newLine2">
          <!-- -------------------- Chips -------------------- -->
          <div>
            <div class="row" align="left">
              <p class="col q-pa-sm header">
                Add Chips:
              </p>

              <q-select
                dense outlined options-dense
                class="col-3"
                label="Chip Type" style="overflow: auto;"
                v-model="chipType"
                :options="chipTypeOptions"
              />

              <div class="col-1 q-mt-sm" align="center" >
                <q-btn
                  :disable="chipType === ''"
                  dense round
                  color="accent" icon="add"
                  @click="addChip(); addedChip = true"
                />
              </div>
            </div>

            <div
              v-for="(chipContent, chipInd) in webpage.chips"
              :key="chipInd"
              class="row q-mt-sm q-mb-sm"
            >
              <!-- -------------------- Chip Type SOURCE -------------------- -->
              <div
                v-if="chipContent.content.type === 'SOURCE'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Source Chip</strong>
                    <hr class="col q-ml-sm">
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm"
                    label="Source" placeholder="Link to source code goes here."
                    v-model="chipContent.content.url"
                    :autofocus="addedChip"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedChip = false"
                  />
                </q-card>
              </div>

              <!-- -------------------- Chip Type VIDEO -------------------- -->
              <div
                v-if="chipContent.content.type === 'VIDEO'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Video Chip</strong>
                    <hr class="col q-ml-sm">
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm" label="Video"
                    placeholder="Link to video goes here. (Currently only supports one.)"
                    v-model="chipContent.content.url"
                    :autofocus="addedChip"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedChip = false"
                  />
                </q-card>
              </div>

              <!-- ------------------ Chip Index & Delete ------------------ -->
              <div class="col-1" style="margin: auto;" >
                <q-checkbox
                  dense
                  class="q-pa-sm q-mb-sm"
                  label="Hide"
                  v-model="webpage.chips[chipInd].hidden"
                />

                <q-input
                  dense filled
                  class="q-pa-xs q-mb-sm"
                  label="Index" type="number"
                  v-model="webpage.chips[chipInd].index"
                  @blur="webpage.chips[chipInd].index = webpage.chips[chipInd].index < 1 ?  1 : parseInt(webpage.chips[chipInd].index)"
                />

                <q-btn
                  dense round
                  class="bottom"
                  color="accent" icon="delete"
                  @click="webpage.chips.splice(chipInd, 1)"
                />
              </div>
            </div>
          </div>

          <hr>

          <!-- -------------------- Custom Field -------------------- -->
          <div>
            <div class="row" align="left">
              <p class="col q-pa-sm header">
                Add Content:
              </p>

              <q-select
                dense outlined options-dense
                class="col-3"
                label="Content Type" style="overflow: auto;"
                v-model="bodyType"
                :options="bodyTypeOptions"
              />

              <div class="col-1 q-mt-sm" align="center" >
                <q-btn
                  :disable="bodyType === ''"
                  dense round
                  color="accent" icon="add"
                  @click="addCustomField(); addedContent = true"
                />
              </div>
            </div>

            <div
              v-for="(bodyContent, ind) in webpage.body"
              :key="ind"
              class="row q-mt-sm q-mb-sm"
            >

              <!-- ----------------- Custom Type TEXT_BOX ----------------- -->
              <div
                v-if="bodyContent.content.type === 'TEXT_BOX'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Text Box</strong>
                    <hr class="col q-ml-sm">
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm"
                    label="Label" placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <q-input
                    filled autogrow
                    class="q-mt-sm" label="Body/Text Description"
                    placeholder="Please enter the body for the respective label."
                    v-model="bodyContent.content.text"
                    :rules="[val => !!val || 'Field is required']"
                  />
                </q-card>
              </div>

              <!-- -------------- Custom Type UNORDERED_LIST -------------- -->
              <div
                v-else-if="bodyContent.content.type === 'UNORDERED_LIST'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Unordered List</strong>
                    <hr class="col q-ml-sm">
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm"
                    label="Label" placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <div class="row inline full-width q-pa-md">
                    <strong>List</strong>
                    <hr class="col q-ml-sm q-mr-sm">
                    <div>
                      <q-btn
                        dense round
                        color="accent" icon="add"
                        @click="bodyContent.content.list.push({})"
                      />
                    </div>
                  </div>

                  <ul>
                    <li
                      v-for="(link, ulIndex) in bodyContent.content.list"
                      :key="ulIndex"
                      align="left"
                    >
                      <div class="row inline full-width q-gutter-xs q-mb-sm">
                        <q-input
                          dense filled
                          class="col" label="URL Name"
                          placeholder="Please enter the alias for the URL."
                          v-model="link.item"
                          :rules="[val => !!val || 'Field is required']"
                        />

                        <q-input
                          dense filled
                          class="col" label="URL"
                          placeholder="https://www.goole.com"
                          v-model="link.url"
                          :rules="[val => true]"
                        />

                        <q-btn
                          :disable="bodyContent.content.list.length === 1"
                          dense flat round
                          icon="delete"
                          @click="bodyContent.content.list.splice(ulIndex, 1)"
                        />
                      </div>
                    </li>
                  </ul>
                </q-card>
              </div>

              <!-- --------------- Custom Type ORDERED_LIST --------------- -->
              <div
                v-else-if="bodyContent.content.type === 'ORDERED_LIST'"
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Ordered List</strong>
                    <hr class="col q-ml-sm">
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm"
                    label="Label" placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <div class="row inline full-width q-pa-md">
                    <strong>List</strong>
                    <hr class="col q-ml-sm q-mr-sm">
                    <div>
                      <q-btn
                        dense round
                        color="accent" icon="add"
                        @click="bodyContent.content.list.push({index: bodyContent.content.list.length + 1})"
                      />
                    </div>
                  </div>

                  <ul>
                    <li
                      v-for="(link, olIndex) in bodyContent.content.list"
                      :key="olIndex"
                      align="left"
                    >
                      <div class="row inline full-width q-gutter-xs q-mb-sm">
                        <q-input
                          dense filled
                          class="col-1"
                          type="number" label="Index"
                          v-model="link.index"
                          @blur="link.index = link.index > 0 ? parseInt(link.index) : 1"
                          :rules="[val => !!val]"
                        />

                        <q-input
                          dense filled
                          class="col" label="URL Name"
                          placeholder="Please enter the alias for the URL."
                          v-model="link.item"
                          :rules="[val => !!val || 'Field is required']"
                        />

                        <q-input
                          dense filled
                          class="col" label="URL"
                          placeholder="https://www.goole.com"
                          v-model="link.url"
                          :rules="[val => true]"
                        />

                        <q-btn
                          :disable="bodyContent.content.list.length === 1"
                          dense flat round
                          icon="delete"
                          @click="bodyContent.content.list.splice(olIndex, 1)"
                        />
                      </div>
                    </li>
                  </ul>
                </q-card>
              </div>

              <!-- ---------------- Custom Type EVENT_LIST ---------------- -->
              <div
                v-else
                class="col q-mb-xs q-pa-sm"
              >
                <q-card class="q-pa-md">
                  <div class="row" align="left">
                    <strong>Event List</strong>
                    <hr class="col q-ml-sm">
                  </div>

                  <q-input
                    filled
                    class="q-mt-sm"
                    label="Label" placeholder="Title"
                    v-model="bodyContent.content.label"
                    :autofocus="addedContent"
                    :rules="[val => !!val || 'Field is required']"
                    @focus="addedContent = false"
                  />

                  <div class="row inline full-width q-pa-md">
                    <strong>List</strong>
                    <hr class="col q-ml-sm q-mr-sm">
                    <div>
                      <q-btn
                        dense round
                        color="accent" icon="add"
                        @click="bodyContent.content.list.push({})"
                      />
                    </div>
                  </div>

                  <ul>
                    <li
                      v-for="(link, evIndex) in bodyContent.content.list"
                      :key="evIndex"
                      align="left"
                    >
                      <div class="row inline full-width">
                        <div class="row inline full-width q-gutter-xs">
                          <q-input
                            dense filled
                            class="col" label="Subject"
                            placeholder="Please enter the subject matter here."
                            v-model="link.subject"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-input
                            dense filled
                            class="col" label="Date and Time"
                            placeholder="2019:06:02.00:00"
                            v-model="link.date"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-btn
                            disable dense flat round
                            @click="bodyContent.content.list.splice(evIndex, 1)"
                          />
                        </div>
                        <div class="row inline full-width q-gutter-xs">
                          <q-input
                            dense filled
                            class="col" label="Body"
                            placeholder="Please enter the details regarding the subject matter."
                            v-model="link.body"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-input
                            dense filled
                            class="col" label="URL"
                            placeholder="https://www.goole.com"
                            v-model="link.url"
                            :rules="[val => !!val || 'Field is required']"
                          />

                          <q-btn
                            :disable="bodyContent.content.list.length === 1"
                            dense flat round
                            icon="delete"
                            @click="bodyContent.content.list.splice(evIndex, 1)"
                          />
                        </div>
                      </div>
                    </li>
                  </ul>

                </q-card>
              </div>

              <!-- ------------- Custom Field Index & Delete --------------- -->
              <div class="col-1" style="margin: auto;" >
                <q-checkbox
                  dense
                  class="q-pa-sm q-mb-sm" label='Hide'
                  v-model="webpage.body[ind].hidden"
                />

                <q-input
                  dense filled
                  class="q-pa-xs q-mb-md"
                  label="Index" type="number"
                  v-model="webpage.body[ind].index"
                  @blur="webpage.body[ind].index = webpage.body[ind].index < 1 ?  1 : parseInt(webpage.body[ind].index)"
                />

                <q-btn
                  dense round
                  class="bottom" color="accent" icon="delete"
                  @click="webpage.body.splice(ind, 1)"
                />
              </div>
            </div>
          </div>
        </div>

        <hr>

        <!-- -------------------- Submit Button -------------------- -->
        <q-btn
          no-caps
          label="Submit Project" type="submit" color="secondary"
          class="half-width"
        />

      </q-form>
      <br><br><br>

    </q-card>
  </div>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import { layoutConfig } from '../../boundless.config'

export default {
  name: 'Submit_Project',
  created () {
    if (this.$q.sessionStorage.has('boundless_config')) {
      let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
      this.layoutConfig = layoutConfig

      if (typeof cachedConfig.enabledChallenges === 'boolean') {
        this.layoutConfig.challenges = cachedConfig.enabledChallenges
      }
    } else {
      this.layoutConfig = layoutConfig
    }

    if (!this.layoutConfig.challenges) {
      this.$router.push('/err')
    }

    this.getDb().then(res => {
      this.getUserList()
      this.getConfig()
    })
  },
  data () {
    return {
      layoutConfig: null,
      // Reference for the database
      db: null,
      // Submit Project related variables
      emailToUuidMap: {}, // Map of emails to uuid
      emailToNameMap: {}, // Map of emails to names
      challengeName: '',
      challengeDescription: '',
      challengeRationale: '',
      sponsors: [{
        name: '',
        email: ''
      }],
      webpage: {
        imgURL: '',
        chips: [],
        body: []
      },
      bodyType: '',
      chipType: '',
      chosenKeywords: [], // keywords chosen by the user
      keywordsOptions: [], // list of keywords from database
      allowedDomain: [],
      bodyTypeOptions: [],
      chipTypeOptions: [],
      addedChip: false,
      addedContent: false,
      loading: false,
      adminMode: false
    }
  },
  methods: {
    // Database calls
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
    getConfig: function () {
      this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            let data = doc.data()

            for (let key in data['keywords']) {
              this.keywordsOptions.push({
                label: key,
                value: data['keywords'][key]
              })
            }

            this.allowedDomain = data['allowedDomain']
            this.bodyTypeOptions = data['bodyContentType']
            this.chipTypeOptions = data['chipContentType']
          }
        })
        .catch(function (error) {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    getUserList: function () {
      this.db.collection('users').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            let tocUserData = doc.data()
            for (let uuid in tocUserData) {
              this.emailToUuidMap[tocUserData[uuid].email] = uuid
              this.emailToNameMap[tocUserData[uuid].email] = tocUserData[uuid].name
            }
          } else {
            /* console.log('No -ToC- document!') */
          }
        })
        .catch(function (error) {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    // Form functions
    onSubmit () {
      // variables for challenge submission
      this.loading = true
      let timeOfSubmit = new Date(Date.now()).toISOString()
      let firestore = this.db.collection('challenges').doc()
      let key = firestore.id

      // user submission stats here
      this.addUserOnSubmit()

      let tmpMembers = []
      this.sponsors.forEach(member => {
        tmpMembers.push({
          uuid: this.emailToUuidMap[member.email]
        })
      })

      // project submission starts here
      if (this.chosenKeywords.length === 0) {
        this.chosenKeywords.push('tbd')
      }

      let newChallenge = {
        uuid: key,
        challenge: this.challengeName,
        description: this.challengeDescription,
        rationale: this.challengeRationale,
        sponsors: tmpMembers,
        keywords: this.chosenKeywords,
        timestamp: timeOfSubmit,
        created: timeOfSubmit,
        projects: [],
        priority: 2,
        hidden: false,
        alias: ''
      }

      firestore.set({
        webpage: this.webpage,
        files: {}
      })

      this.db.collection('challenges').doc('ToC').set({
        [key]: newChallenge
      }, { merge: true })

      this.onReset()
    },
    onReset () {
      this.challengeName = ''
      this.challengeDescription = ''
      this.challengeRationale = ''
      this.sponsors = [{
        name: '',
        email: ''
      }]
      this.webpage = {
        imgURL: '',
        chips: [],
        body: []
      }
      this.bodyType = ''
      this.chipType = ''
      this.chosenKeywords = []

      for (let ref in this.$refs) {
        if (!ref.includes('member')) {
          this.$refs[ref].resetValidation()
        }
      }
      this.$refs.memberEmail0[0].resetValidation()
      this.$refs.memberName0[0].resetValidation()

      this.loading = false

      this.$q.notify({
        icon: 'done',
        color: 'positive',
        message: 'Submitted sucessfully!',
        closeBtn: 'Okay!'
      })

      this.$emit('added')
    },
    addUserOnSubmit: function () {
      this.sponsors.forEach(member => {
        if (!(member.email in this.emailToUuidMap)) {
          let timeOfSubmit = new Date(Date.now()).toISOString()
          let firestore = this.db.collection('users').doc()
          let key = firestore.id

          let newUser = {
            uuid: key,
            name: member.name,
            email: member.email,
            title: '',
            imgURL: '',
            timestamp: timeOfSubmit,
            created: timeOfSubmit
          }

          this.emailToUuidMap[newUser.email] = key
          this.emailToNameMap[newUser.email] = newUser.name

          this.db.collection('users').doc(key).set({
            socialNetwork: {},
            projects: [],
            achievements: {}
          })

          this.db.collection('users').doc('ToC').set({
            [key]: newUser
          }, { merge: true })
        }
      })
    },
    emailDomainCheck: function (indexEmail, index) {
      let validEmail = false
      indexEmail = indexEmail.toLowerCase()

      if (this.allowedDomain.length > 0) {
        this.allowedDomain.forEach(entry => {
          if (indexEmail.includes(entry)) {
            validEmail = true
          }
        })
      } else {
        validEmail = true
      }

      if (!validEmail) {
        this.$q.notify({
          color: 'negative',
          message: `Only [${this.allowedDomain.join(', ')}] are allowed!`,
          icon: 'warning',
          closeBtn: 'Close'
        })

        this.sponsors[index].email = ''
      } else {
        this.sponsors[index].email = indexEmail
      }

      if (indexEmail in this.emailToNameMap) {
        this.sponsors[index].name = this.emailToNameMap[indexEmail]

        this.$q.notify({
          message: 'Since the user already exists in the database, the name of the user is loaded from the database.',
          color: 'positive'
        })
      } else {
        if (indexEmail !== '') {
          this.$q.dialog({
            dark: true,
            title: 'Prompt',
            message: 'Please enter the email again.',
            persistent: true,
            prompt: {
              model: '',
              type: 'text'
            }
          }).onOk(data => {
            data = data.toLowerCase()
            if (data !== indexEmail) {
              this.$q.notify({
                message: 'The emails must be indentical.',
                color: 'negative'
              })
              this.sponsors[index].email = ''
            } else {
              this.$q.notify({
                message: 'The user will be registered during project submit.',
                color: 'positive'
              })
            }
          })
        }
      }
    },
    capitalizeFirstChar: function (index) {
      let nameToken = this.sponsors[index].name.split(' ')

      if (nameToken.length < 2 && nameToken[0] !== '') {
        this.$q.notify({
          position: 'top',
          color: 'negative',
          message: 'Please enter "{First Name} {Last Name}" and thank you!'
        })
        this.sponsors[index].name = ''
      } else if (nameToken.length >= 2) {
        if (nameToken.includes('')) {
          this.$q.notify({
            position: 'top',
            color: 'negative',
            message: 'Invalid name!'
          })
          this.sponsors[index].name = ''
        } else {
          for (let i = 0; i < nameToken.length; i++) {
            nameToken[i] = nameToken[i].charAt(0).toUpperCase() + nameToken[i].substr(1)
          }
          this.sponsors[index].name = nameToken.join(' ')
        }
      }
    },
    addSponsor: function () {
      this.sponsors.push({
        name: '',
        email: '',
        role: 'member'
      })
    },
    addCustomField: function () {
      let tmpBody = {}

      if (this.bodyType.value === 'TEXT_BOX') {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value
          }
        }
      } else if (this.bodyType.value === 'UNORDERED_LIST') {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {}
            ]
          }
        }
      } else if (this.bodyType.value === 'ORDERED_LIST') {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {
                index: 1
              }
            ]
          }
        }
      } else {
        tmpBody = {
          index: this.webpage.body.length + 1,
          content: {
            type: this.bodyType.value,
            list: [
              {}
            ]
          }
        }
      }
      tmpBody['hidden'] = false
      this.webpage.body.push(tmpBody)
    },
    addChip: function () {
      let tmpChip = {}
      // let unique = true

      // this.webpage.chips.forEach(chip => {
      /* //   console.log(chip.content.type) */
      //   if (chip.content.type === this.chipType.value) {
      //     unique = false
      //   }
      // })

      if (this.chipType.value === 'SOURCE') {
        tmpChip = {
          index: this.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'code'
          }
        }
      } else if (this.chipType.value === 'VIDEO') {
        tmpChip = {
          index: this.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value,
            icon: 'movie'
          }
        }
      } else {
        tmpChip = {
          index: this.webpage.chips.length + 1,
          content: {
            label: this.chipType.label,
            type: this.chipType.value
          }
        }
      }
      tmpChip['hidden'] = false
      this.webpage.chips.push(tmpChip)
    },
    // Helper functions
    activateAdmin: function () {
      this.adminMode = true
      this.$q.notify({
        message: 'Admin mode activated! Enjoy.',
        color: 'positive'
      })
    }
  }
}
</script>

<style lang="stylus">
hr.newLine {
  border: 1px solid #ce2029;
}

hr.newLine2 {
  display: block; height: 1px;
  border: 1; border-top: 1px solid #ccc;
  margin: 0em; padding: 0em;
}

br.small {
  display: block; /* makes it have a width */
  content: "";    /* clears default height */
  margin-top: 0em;  /* change this to whatever height you want it */
}

h4 {
  font-size: 2.0em;
  /* background-color: #ccc; width: 80%; */
  margin: 10px;
  padding: 10px;
}

.header {
  font-size: 16px;
  font-weight: bold;
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
</style>
