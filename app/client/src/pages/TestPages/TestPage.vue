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
      <div class="q-pa-md text-h4 text-primary text-center">
        Infonter-RTP Client/Server Type Messaging
        <q-separator/>
      </div>

      <div class="q-pa-sm q-col-gutter-md row items-start">
        <div class="col-4">
          <q-img
            class="project-img"
            src="statics/images/project-img-6.jpg"
            :ratio="4/3"
          />
        </div>
        <div class="col-8">
           <div class="text-h5">
            Overview
            <q-separator color="secondary" />
            </div>
            <p class="q-pa-sm">
              Inter-RTP messaging for VxWorks implementing send-receive-reply paradigm that enables implementation of a fast and efficient communication channel for client server type applications, such as an IOS proxy server, user space file systems, user space network stack, etc.
            </p>
        </div>
      </div>
      <q-separator inset />
        <div class="q-pa-md text-h7" align="center">
          progress
          <br>
          <q-img
            class="progress-bar"
            src="statics/images/IdeaPoC-.png"
            :ratio="18/3"
          />
        </div>

        <q-separator inset />
        <div class="q-pa-md" align="center">
          <q-chip clickable @click="onClick" color="secondary" text-color="white" icon="star">
              Impact Awards
          </q-chip>

          <q-chip clickable @click="onClick" color="secondary" text-color="white" icon="code">
              Source
          </q-chip>
          <q-chip clickable @click="onClick" color="secondary" text-color="white" icon="photo_camera">
              Gallery
          </q-chip>
          <q-chip clickable @click="onClick" color="secondary" text-color="white" icon="movie">
              Video
          </q-chip>

          <q-chip clickable @click="onClick" color="secondary" text-color="white" icon="vpn_key">
              Keywords
          </q-chip>
          </div>

        <div class="text-h5 q-mt-sm">Challenge</div>
        <q-separator color="secondary" />
            <p class="q-pa-sm">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi
                minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi
                minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                </p>

        <div class="text-h5 q-mt-sm">Solution</div>
        <q-separator color="secondary" />
            <p class="q-pa-sm">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi
                minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                </p>

        <div class="text-h5 q-mt-sm">Team</div>
        <q-separator color="secondary" />
        <ul>
            <li>
                Phyo Htut
            </li>
            <li>
                Mark Gisi
            </li>
           </ul>

        <div class="text-h5 q-mt-sm">circle</div>
        <q-separator color="secondary" />
        <div class= "q-pa-md">

        <div>
        <div id="circle1" class="circle">
          <q-img
            class="project-img"
            src="statics/images/diamond3-icon.png"
            :ratio="1/1"
          /></div>
          <br>
          Trade Show </div>
        <div id="circle2" class="circle"></div>
        <div id="circle3" class="circle"><div id="circle4" class="circle"></div></div>
        </div>

        <br>

        <div id="circleGold" class="circle">
          <q-img
            class="project-img"
            src="statics/images/diamond3-icon.png"
            :ratio="1/1"
          />
          <br>
          Test Text
        </div>
         <div id="circleSilver" class="circle">
            <p> Test Text </p>
        </div>
         <div id="circleBrown" class="circle">
            <p> Test Text </p>
        </div>

         <div class="text-h5 q-mt-sm">References</div>
         <q-separator color="secondary" />
            <ul color="green">
              <li color="secondary">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
            </li>
           </ul>
        <div class="text-h5 q-mt-sm">Awards</div>
         <q-separator color="secondary" />
         <!-- ------------------------- Row -------------------- -->
         <div class="q-pa-sm row items-start" style="height: 320px; text-align: center;">
            <!-- --- Column --- -->
            <div class="col-3 q-pa-sm">
              <div id="circleGold" class="circle q-pa-sm">
                <q-img
                  class="project-img"
                  src="statics/images/diamond3-icon.png"
                  :ratio="1/1"
                />
              </div>
              <div class="q-pa-sm" style="">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem,</div>
            </div>
            <!-- --- Column --- -->
            <div class="col-3 q-pa-sm">
                <div id="circleSilver" class="circle q-pa-sm">
                  <q-img
                    class="project-img"
                    src="statics/images/diamond3-icon.png"
                    :ratio="1/1"
                  />
                </div>
              <div class="q-pa-sm" style="">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem,</div>
            </div>
            <!-- --- Column --- -->
            <div class="col-3 q-pa-sm">
                <div id="circleGold" class="circle q-pa-sm">
                  <q-img
                    class="project-img"
                    src="statics/images/diamond3-icon.png"
                    :ratio="1/1"
                  />
                </div>
              <div>
                <div class="q-pa-sm text-h6 text-primary text-center">
                  This is the title
                </div>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem,</div>
            </div>
            <!-- --- Column --- -->
            <div class="col-3 q-pa-sm">
                <div id="circleBronze" class="circle q-pa-sm">
                  <q-img
                    class="project-img"
                    src="statics/images/diamond3-icon.png"
                    :ratio="1/1"
                  />
                </div>
              <div class="q-pa-sm" style="">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem,</div>
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
