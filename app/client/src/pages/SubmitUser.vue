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

Name:     pages/SubmitUser.vue
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
      style="margin: auto; max-width: 1000px"
    >
      <br class="small">
      <h4>New User</h4>

      <q-form
        @submit="onSubmit"
        class="q-pd-md"
        style="max-width: 80%;"
      >
        <hr>

        <!-- -------------------- User Name -------------------- -->
        <q-input
          filled lazy-rules
          ref="userName"
          class="q-mt-sm"
          v-model="user.name"
          placeholder="ie. John Doe" label="Full Name"
          :rules="[val => !!val || 'Field is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <!-- -------------------- User Email -------------------- -->
        <q-input
          filled lazy-rules
          class="q-mt-sm"
          ref="eMail"
          v-model="user.email"
          label="Email" type="email"
          placeholder="ie. john.doe@gmail.com"
          :rules="[val => !!val || 'Field is required']"
          @blur="checkEmail(user.email)"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <!-- -------------------- MIGHT NEED IN FUTURE -------------------- -->
        <!-- <div class="row q-mt-sm">
          <div class="col-1">Optional</div>
          <hr class="col">
        </div>

        <q-input
          filled
          class="q-mt-sm"
          v-model="webpage.socialNetwork.github"
          label="GitHub Username" type="text"
          placeholder="ie. johndoe"
          @blur="webpage.socialNetwork.github = webpage.socialNetwork.github.toLowerCase()"
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-github" />
          </template>
        </q-input>

        <q-input
          filled
          class="q-mt-sm"
          v-model="webpage.socialNetwork.jive"
          label="Jive Username" type="text"
          placeholder="ie. johndoe"
          @blur="webpage.socialNetwork.jive = webpage.socialNetwork.jive.toLowerCase()"
        >
          <template v-slot:prepend>
            <q-icon name="fab fa-github" />
          </template>
        </q-input> -->

        <hr>

        <q-btn
          no-caps
          label="Submit User" type="submit" color="secondary"
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

export default {
  created () {
    this.loadFireRefs().then(res => {
      this.loadUserList()
      this.loadAllowedDomain()
    })
  },
  data () {
    return {
      db: null,
      emailList: [],
      allowedDomain: [],
      user: {},
      webpage: {},
      loading: false
    }
  },
  methods: {
    onSubmit: function () {
      /*
      // submits the new user to the user database
      // instantiate a webpage for the new user
      // return: Promise<Boolean>
      */

      this.loading = true

      let timeOfSubmit = new Date(Date.now()).toISOString()
      let firestore = this.db.collection('users').doc()
      let key = firestore.id

      this.user = {
        timestamp: timeOfSubmit,
        created: timeOfSubmit,
        uuid: key,
        imgURL: '',
        title: ''
      }

      this.webpage = {
        socialNetwork: {},
        projects: [],
        achievements: {}
      }

      return firestore.set(this.webpage).then(() => {
        return this.db.collection('users').doc('ToC').set({
          [key]: this.user
        }, { merge: true })
      }).then(() => {
        this.onReset()
        return true
      }).catch(err => {
        if (err) {
          return false
        }
      })
    },
    onReset: function () {
      /*
      // resets the input values
      // notify the submission was a sucess
      */

      this.user = {}
      this.webpage = {}

      this.$q.notify({
        icon: 'done',
        color: 'positive',
        message: 'Submitted sucessfully!',
        closeBtn: 'Okay!'
      })

      this.loading = false
      this.$emit('added')
    },
    checkEmail: function (entry) {
      /*
      // TODO: function description
      // params:
      // // @entry:
      */
      // TODO
      if (!this.emailList.includes(entry) && entry.includes('@')) {
        this.emailDomainCheck(entry)
      } else {
        this.user.email = ''
      }
    },
    emailDomainCheck: function (email) {
      /*
      // TODO: function description
      // params:
      // // @email:
      */

      let validEmail = false
      email = email.toLowerCase()

      if (!this.allowedDomain || this.allowedDomain.length < 1) {
        validEmail = true
      } else {
        this.allowedDomain.forEach(entry => {
          if (email.includes(entry)) {
            validEmail = true
          }
        })
      }

      if (!validEmail) {
        this.$q.notify({
          color: 'negative',
          message: `Only [${this.allowedDomain.join(', ')}] are allowed!`,
          icon: 'warning',
          closeBtn: 'Close'
        })

        this.user.email = ''
      } else {
        this.user.email = email
      }
    },
    loadFireRefs: function () {
      /*
      // load firebase database reference
      // load firebase storage reference (if applicable)
      // load firebase cloud functions reference (if applicable)
      // return: Promise<String>
      */

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
    loadAllowedDomain: function () {
      /*
      // TODO: function description
      // return: Promise<Boolean>
      */
      // TODO: no need to load from db
      return this.db.collection('config').doc('project').get()
        .then(doc => {
          if (doc.exists) {
            this.allowedDomain = doc.data()['allowedDomain']
          } else {
            throw new Error('config/project is not available!')
          }
          return true
        })
        .catch(function (error) {
          if (error) {
            return false
          }
        })
    },
    loadUserList: function () {
      /*
      // TODO: function description
      // return: Promise<Boolean>
      */

      return this.db.collection('users').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            let tocUserData = doc.data()

            for (let user in tocUserData) {
              this.emailList.push(tocUserData[user].email)
            }
          } else {
            throw new Error('users/ToC is not available!')
          }

          return true
        })
        .catch(() => false)
    }
  }
}
</script>

<style lang="stylus">

</style>
