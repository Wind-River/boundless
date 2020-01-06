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

Name:     components/SubmitChallengeAdminConsole.vue
Purpose:
Methods:
  *

## -->

<template>
  <div class="q-pa-lg">
    <q-layout>

      <br>
      <submitPage @added="emitAdded" />

      <q-page-sticky
        position="bottom-right"
        :offset="[30, 18]"
      >
        <q-btn
          round
          class="q-ml-xs"
          color="accent"
          icon="clear"
          @click="emitClose"
        >
          <q-tooltip content-class="bg-indigo" :offset="[0, 20]">
            Close
          </q-tooltip>
        </q-btn>
      </q-page-sticky>

    </q-layout>
  </div>
</template>

<script>
import submitPage from '../pages/SubmitChallenge'

export default {
  name: 'Submit_Challenge',
  components: {
    submitPage
  },
  data () {
    return {

    }
  },
  methods: {
    emitClose: function () {
      this.$emit('close')
    },
    emitAdded: function () {
      this.$emit('added')
    }
  }
}
</script>

<style lang="stylus">

</style>
