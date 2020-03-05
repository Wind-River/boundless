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

Name:     components/Banners/Banners.vue
Purpose:  Components which helps render the banner
Methods:
  * Renders the dynamic banner

## -->

<template>
  <!-- -------------- Banner -------------- -->
  <div class="q-mb-sm">
    <div
      v-if="bannerObj.type === 'webpage'"
      align="center"
      style="
        margin: auto;
        max-width: 1000px;
        min-width: 800px;
      "
    >
      <q-img
        contain
        :src="imgURL"
        :ratio="bannerObj.ratio"
      />
    </div>

    <div
      v-if="bannerObj.type === 'table'"
      align="center"
    >
      <q-img
        contain
        :src="imgURL"
        :ratio="bannerObj.ratio"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bannerObj: Object
  },
  created () {
    // load this.imgURL from either session cache or pass-in object
    if (this.$q.sessionStorage.has('boundless_config')) {
      let dbConfig = this.$q.sessionStorage.getItem('boundless_config')
      let type = this.bannerObj.type === 'webpage' ? 'webpage' : 'listingTable'

      if (dbConfig[`${this.bannerObj.category}Config`][type].bannerImg.active) {
        let configObj = dbConfig[`${this.bannerObj.category}Config`]

        this.imgURL = configObj[type].bannerImg.url
      } else {
        this.imgURL = this.bannerObj.path
      }
    } else {
      this.imgURL = this.bannerObj.path
    }
  },
  data () {
    return {
      imgURL: '' // <String>: url or path of the banner image
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
