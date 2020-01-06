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
  <div
    class="shadow-2 q-pa-md"
    style="
      margin: 1% auto;
      border-radius: 3px;
      max-width: 98%;
    "
  >
    <div
      class="q-mb-md"
      align="center"
    >
      <strong>Sign Up</strong>
      <hr>
    </div>

    <q-form
      class="q-gutter-sm"
      @submit="onSubmit"
    >
      <q-input
        dense
        filled
        label="Email"
        placeholder="Enter email..."
        type="email"
        v-model="email"
      />
      <q-input
        dense
        filled
        label="Password"
        placeholder="Enter password..."
        type="password"
        v-model="password"
      />

      <div align="center">
        <q-btn
          label="Sign Up"
          no-caps
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { auth } from '../firebase/init_production'

export default {
  name: 'Sign_Up',
  created () {

  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    onSubmit: function () {
      /* // console.log(this.email, this.password) */
      this.signUsersUp()
    },
    onReset: function () {
      this.email = ''
      this.password = ''
    },
    signUsersUp: function () {
      auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          /* console.log(user) */
          this.onReset()
        })
        .catch(err => {
          if (err) {
            /* console.log(err) */
          }
        })
    }
  }
}
</script>

<style lang='stylus'>

</style>
