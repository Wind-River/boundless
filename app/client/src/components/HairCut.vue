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

Name:     components/HairCut.vue
Purpose:
Methods:
  *

## -->

<template>
  <div v-if="loading" class="absolute-center">
    <q-spinner
      color="primary"
      size="8em"
    />
  </div>
  <div
    v-else
    style="margin: auto; overflow: auto;"
  >
    <div class="hairContainer">
      <div class="hairWrapper">
        <!-- Head -->
        <div class="head_smiley">
          <!-- Eyes -->
          <div class="eyes">
            <div class="left"></div>
            <div class="right"></div>
          </div>
          <!--Mouth-->
          <div class="mouth"></div>
        </div>

         <!--Hair-->
        <div
          v-for="index in hairCount"
          :key="index"
          class="hair_index"
        >
        </div>

      </div>
    </div>

    <div :hidden="true"  class="text-h5" align="center">
      Haircut for Rabih
      <q-input
        label="Project to go ..."
        outlined
        style="max-width: 200px"
        v-model="hairCount"
        @blur="hairCount = parseInt(hairCount)"
        @keydown.prevent.enter="hairCount = parseInt(hairCount)"
        type="number"
      />
      <q-btn push  class="q-ma-sm" color="secondary" size="md" icon= "fas fa-cut" @click="hairCount -= 5"/>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    hairCount: Number
  },
  created () {
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    doneLoading: function () {
      this.loading = false
    }
  },
  watch: {
    hairCount: 'doneLoading'
  }
}
</script>

<style lang="stylus">

.hairContainer{
  width: 100%;
  max-width: 1140px;
  overflow: hidden;
  margin: auto;
}

.hairWrapper{
  width: 285px;
  position: relative;
  padding-top: 65px;
  overflow: hidden;
}

.head_smiley{
  width: 150px;
  height: 150px;
  overflow: hidden;
  background: linear-gradient(to bottom, #ffde00 40%, #ffc000 70%);
  border-radius: 50%;
  position: relative;
  border: 8px solid #000;
  margin: 0 auto;
  z-index: 1
}

.eyes .left{
  width: 0;
  height: 5px;
  border: 8px solid #000;
  border-radius: 50%;
  position: absolute;
  left: 40px;
  top: 50px;
}

.eyes .right{
  width: 0;
  height: 5px;
  border: 8px solid #000;
  border-radius: 50%;
  position: absolute;
  right: 40px;
  top: 50px;
}

.mouth{
  width: 110px;
  height: 130px;
  border-top: 8px solid transparent;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  border-bottom: 8px solid #000;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

.hair_index{
  width: 41%;
  height: 1px;
  background: #000;
  position: absolute;
  right: 9%;
  bottom: 35%;
  -webkit-transform-origin: 0% 0%;
  transform-origin: 0% 0%;
  webkit-transform: rotate((-90)deg);
  transform: rotate((-90)deg);
}

for i in (1..250)
  .hair_index:nth-of-type({i})
    if odd(i)
      webkit-transform: rotate((-90 + i * .48)deg);
      transform: rotate((-90 + i * .48)deg);
      width: (40 - i * .04)%;
      right: (10 + i * .04)%;
    else
      webkit-transform: rotate((-88 - i * .48)deg);
      transform: rotate((-88 - i * .48)deg);
      width: (40 - i * .04)%;
      right: (10 + i * .04)%;

</style>
