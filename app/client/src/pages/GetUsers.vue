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

Name:     pages/GetUsers.vue
Purpose:  Vue script to load all the users list (will be replaced with GCF)
Methods:
  * Returns and list out all the user information from the production server

## -->

<template>
  <q-card
    class="q-pa-md" style="max-width: 98%; margin: auto; margin-top: 1%;"
  >
    <div
      v-for="(email, emailInd) in emails"
      :key="emailInd"
    >
      {{ email }}
    </div>
  </q-card>
</template>

<script>
import db from '../firebase/init_production'

export default {
  created () {
    db.collection('users').get()
      .then(docs => {
        docs.forEach(doc => {
          if (doc.id !== 'ToC') {
            this.emails.push(doc.id)
          }
        })
      })
      .catch(err => {
        if (err) {
        }
      })
  },
  data () {
    return {
      // emails <Array<Object>>
      emails: []
    }
  }
}
</script>

<style lang="stylus">

</style>
