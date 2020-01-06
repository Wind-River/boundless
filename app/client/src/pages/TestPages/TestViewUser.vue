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
    <div v-if="loading" class="absolute-center">
      <q-spinner
        color="primary"
        size="8em"
      />
    </div>

    <div v-else
      align="center"
      style="margin: auto; max-width: 1000px; min-width: 800px;"
      :class="'shadow-2'"
    >
      <br class="small">

      <div class="q-pa-md" align="left">

        <div class="q-pa-md text-h4 text-primary text-center">
          <!-- {{ data.name }} -->
          Mark Gisi
          <q-separator />
        </div>

        <div class="q-pa-sm q-col-gutter-md row items-start" style="height: 320px;">

          <div class="col-9">
            <div class="row q-mt-sm q-mb-sm" style="max-height: 240px;">
              <!-- -------------------------  Image  ------------------------------>
              <div class="col-5 q-mt-sm">
                <q-img
                  class="project-img"
                  src="statics/images/person_icon.png"
                  :ratio="4/3"
                />
            </div> <!-- col-5 -->
            <!-- -------------------------  User Info box ----------------------------->
            <div class="col-5 q-pa-sm">
              <q-list bordered  class="rounded-borders" style="max-width: 500px">
                <!-- <q-item-label header>Core Info</q-item-label> -->
                <q-item>
                  <q-item-section avatar top>
                    <q-icon name="email" color="secondary" size="34px" />
                  </q-item-section>
                  <q-item-section top>
                    <q-item-label lines="1">
                      <span class="text-grey-8"> mark.gisi@windriver.com</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item>
                  <q-item-section avatar top>
                    <q-icon name="account_box" color="secondary" size="34px" />
                  </q-item-section>
                  <q-item-section top>
                    <q-item-label lines="1">
                      <span class="text-grey-8">mgisi (user id)</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item>
                  <q-item-section avatar top>
                    <q-icon name="fab fa-github" color="secondary" size="34px" />
                  </q-item-section>

                  <q-item-section top>
                    <q-item-label lines="1">
                      <span class="text-grey-8"> markgisi</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
             </div> <!-- <div class="col overviewCSS"> -->
            </div> <!-- info box col -->
          </div> <!-- <div class="col-9"> -->
        </div> <!-- <div class="q-pa-sm q-col-gutter-md row  -->
      </div> <!-- <div class="q-pa-md" align="left"> -->

   <q-card class="q-pa-md customCard">
      <p style="font-size: 18px;" align="center"><strong>Admin Console</strong></p>
      <q-separator class="q-mb-sm" color="secondary"></q-separator>

      <q-tabs
        v-model="parentOption"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="secondary"
        align="justify"
      >
        <q-tab name="projects" label="Projects" no-caps />
        <q-tab name="users" label="Users" no-caps />
        <q-tab name="systems" label="Systems" no-caps />
      </q-tabs>

      <div :hidden="parentOption !== 'projects'">

        <q-tab-panel name="delete_projects">
          <manageProjects />
        </q-tab-panel>

      </div>

      <div :hidden="parentOption !== 'users'">

        <q-tab-panel name="delete_users">
          <manageUsers />
        </q-tab-panel>

      </div>

      <div :hidden="parentOption !== 'systems'">
        <div>
          Projects
        </div>
        <q-separator color="secondary" />
        <p>Something goes here!</p>

        <div>
          Users
        </div>
        <q-separator color="secondary" />
        <p>Something goes here!</p>

        <div>
          General
        </div>
        <q-separator color="secondary" />
        <systemSettings />
      </div>

    </q-card>

   </div> <!-- v-else ??? -->

</q-page>
</template>

<script>
import db from '../firebase/init_testing'
import { Promise } from 'q'

export default {
  name: 'View_User',
  created () {
    // fetech data from database
    // this.getInformation()
  },
  data () {
    return {
      userName: this.$route.params.user_name,
      loading: false,
      data: {}
    }
  },
  methods: {
    updateId: function () {
      this.userName = this.$route.params.user_name
      this.getInformation()
    },
    getInformation: function () {
      this.loading = true
      var promises = []
      promises.push(db.collection('users').doc(this.userName).get())
      promises.push(db.collection('users').doc('ToC').get())

      Promise.all(promises)
        .then(res => {
          /* // console.log(res[0].data()) */
          this.data['github'] = res[0].data()['github']
          this.data['jive'] = res[0].data()['jive']
          /* // console.log(res[1].data()[this.userName]) */
          this.data['name'] = res[1].data()[this.userName]['name']
          this.data['email'] = res[1].data()[this.userName]['email']
          /* // console.log(this.data) */
          setTimeout(() => {
            this.loading = false
          }, 100)
        })
        .catch(error => {
          if (error) {
            /* console.log(error) */
          }
        })

      // instant display or display after load?
      // this.loading = false
      // setTimeout(() => {
      //   this.loading = false
      // }, 500)
    },
    getMainPhoto: function () {
      var max = 5
      var photoId = Math.floor(Math.random() * (max - 1 + 1)) + 1
      return 'statics/images/project-img-' + photoId + '.jpg'
    }
  },
  watch: {
    $route: 'updateId'
  }
}
</script>

<style lang="stylus" scoped>
.shadow-box {
  width 90px
  height 90px
  margin 25px
  border-radius 50%
  font-size 12px
}

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

.my-card
  width 100%
  max-width 250px

.project-img {
  border: 3px solid #ddd;
  border-radius: 4px;
  padding: 5px
}

.progress-bar {
  min-width: 150px;
  max-width: 35%
  min-height: 50px;
  height: 30px;
  line-height: 45px;
  text-align: center;
  font-family: Verdana, Arial, sans-serif;
  font-weight: 500;
  border: solid 1.5px;
  border-color: gray;
}

/* Colors from: https://www.december.com/html/spec/color2.html */
.full-color {
  background-image: linear-gradient(#00EE00, #9AFF9A, #00EE00)
}

/* Colors from: https://www.december.com/html/spec/color1.html */
.half-full-color {
  background-image: linear-gradient(#FFE600, #FFF68F, #FFE600)
}

/* Colors from: https://www.december.com/html/spec/color0.html */
.null-color {
  background-image: linear-gradient(#E0E0E0, #F5F5F5, #E0E0E0)
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

.overviewCSS {
  max-height: 240px;
  overflow: auto;
}
</style>
