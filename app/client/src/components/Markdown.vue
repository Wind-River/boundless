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

Name:     components/Markdown.vue
Purpose:
Methods:
  * Displays the quick summary of how many projects, innovators, and challanges are currently registered

## -->

<template>
  <div class="q-pa-md">

    <q-splitter class="q-gutter-sm" v-model="splitterModel" :limits="[30, 70]" >

      <template v-slot:before>
        <div class="q-pa-md">
          <q-input
            autogrow outlined dense
            debounce="300" type="textarea"
            v-model="generalConfig.data"
          />
        </div>

        <div class="q-px-md q-gutter-md">
          <q-btn outline label="Background Color">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color
                flat no-header no-footer
                v-model="generalConfig.bgColor"
              />
              <q-btn class="float-right" flat v-close-popup >Done</q-btn>
            </q-popup-proxy>
          </q-btn>

          <q-btn outline label="Text Color">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color
                flat no-header no-footer
                v-model="generalConfig.txtColor"
              />
              <q-btn class="float-right" flat v-close-popup >Done</q-btn>
            </q-popup-proxy>
          </q-btn>

          <q-btn
            outline v-close-popup
            class="float-right" color="green"
            @click="submitMarkdown"
          >
            Submit
          </q-btn>

          <q-btn flat v-close-popup class="float-right" >
            Cancel
          </q-btn>

        </div>
      </template>

      <template v-slot:separator>
        <q-avatar
          color="info"
          text-color="white"
          size="40px" icon="drag_indicator"
        />
      </template>

      <template v-slot:after>
        <div
          class="q-pa-md"
          :style="{
            backgroundColor: generalConfig.bgColor,
            color: generalConfig.txtColor
          }"
        >
          <q-markdown :src="generalConfig.data" />
        </div>
      </template>

    </q-splitter>

  </div>
</template>

<script>
export default {
  props: {
    db: Object
  },
  created () {
    if (this.$q.sessionStorage.has('boundless_config')) {
      let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')

      this.generalConfig = cachedConfig.generalConfig || this.generalConfig
    }
  },
  data () {
    return {
      generalConfig: {
        data: ':::\nPut your markdown here\n\nClassic markup: :wink: :joy: :cry: :angel: :heart: :beers: :laughing: :yum:\n\nShortcuts (emoticons): :-) :-( 8-) ;)\n:::\nMax fixed size image: 200x200; responsive\n![Minion](https://octodex.github.com/images/minion.png =200x200)\n\n# Best of all, the box autogrows!\n',
        bgColor: '#000000',
        txtColor: '#ffffff'
      },
      splitterModel: 50
    }
  },
  methods: {
    submitMarkdown: function () {
      let cachedConfig = this.$q.sessionStorage.getItem('boundless_config')
      cachedConfig.generalConfig = this.generalConfig

      this.$q.sessionStorage.set('boundless_config', cachedConfig)

      return this.db.collection('config').doc('project').update({
        generalConfig: this.generalConfig
      }).catch(err => {
        if (err) {
          throw new Error(err)
        }
      })
    }
  }
}
</script>

<style lang="stylus">

</style>
