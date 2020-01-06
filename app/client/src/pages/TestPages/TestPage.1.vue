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
    <q-page class="q-pa-lg">

        <div class="text-h5 q-mt-sm">Awards</div>
         <q-separator color="secondary" />
         <!-- ------------------------- Row -------------------- -->
         <div class="q-pa-sm row items-start" style="height: 320px; text-align: center;">
            <!-- --- Column --- -->
            <div class="col-3 q-pa-sm">
                <div class="q-pa-sm text-h6 text-primary text-center">
                  100,000 points
                </div>
              <div id="circleGold" class="circle q-pa-sm">
                <q-img
                  class="project-img"
                  src="statics/images/diamond3-icon.png"
                  :ratio="1/1"
                />
              </div>

              <div class="q-pa-sm text-h6 text-primary text-center">
                Gold<br>
                RISC V
                </div>

              <div class="q-pa-sm" style="" align="justify">New RISC V hardware architecture support for VxWorks7.</div>
              </div>
            <!-- --- Column --- -->
            <div class="col-3 q-pa-sm">
               <div class="q-pa-sm text-h6 text-primary text-center">
                  50,000 points
                </div>
                <div id="circleSilver" class="circle q-pa-sm">
                  <q-img
                    class="project-img"
                    src="statics/images/diamond3-icon.png"
                    :ratio="1/1"
                  />
                </div>

                 <div class="q-pa-sm text-h6 text-primary text-center">
                  Silver <br>
                  VxWorks 3PP Framework
                </div>

              <div class="q-pa-sm" style="" align="justify">New VxWorks7 third party port framework.</div>
              </div>

            <!-- --- Column --- -->
            <div class="col-3 q-pa-sm">
               <div class="q-pa-sm text-h6 text-primary text-center">
                  5,000 points
                </div>
                <div id="circleBronze" class="circle q-pa-sm">
                  <q-img
                    class="project-img"
                    src="statics/images/diamond3-icon.png"
                    :ratio="1/1"
                  />
                </div>

                <div class="q-pa-sm text-h6 text-primary text-center">
                  Bronze <br>
                  VxWorks7 Raspberry Pi BSP
                </div>

              <div class="q-pa-sm" style="" align="justify">VxWorks7 Raspberry Pi Board Support Package (BSP) support</div>
            </div>
         </div>
    </q-page>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="stylus" scoped>
.my-card
  width 100%
  max-width 250px

.project-img {
  border: 3px solid #ddd;
  border-radius: 50%;
  padding: 5px
}

.progress-bar {
  border: 3px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 30%;
  max-width 300px;
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
.circle {
    border-radius: 50%;
    display: inline-block;
    margin-right: 20px;
}
#circleGold {
    width: 200px;
    height: 200px;
    background: white;
    border: 15px solid gold;
  }

  #circleSilver {
    width: 200px;
    height: 200px;
    background: white;
    border: 15px solid silver;
  }

   #circleBronze {
    width: 200px;
    height: 200px;
    background: white;
    border: 15px solid #cd7f32;
  }

  #circle1 {
    width: 200px;
    height: 200px;
    background: white;
    border: 15px solid silver;
  }
  #circle2 {
    width: 125px;
    height: 125px;
    background: red;
  }
  #circle3 {
    width: 100px;
    height: 100px;
    background: blue;
    position: relative;
  }
  #circle4 {
    width: 50px;
    height: 50px;
    background: orange;
    position: absolute;
    top: 24%;
    left: 24%;
    display: block;
    border: 3px solid #fff;
  }
</style>
