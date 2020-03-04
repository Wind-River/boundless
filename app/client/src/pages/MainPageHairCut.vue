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

Name:     pages/MainPageHairCut.vue
Purpose:  Under development
Methods:
  * TBD

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
    class="shadow-2 q-pa-md"
    style="max-width: 98%; min-width: 900px; margin: auto; border-radius: 3px; margin-top: 2%;"
  >

    <div
      class="q-pa-md"
      align="center"
    >
      <q-icon name="fas fa-cut" style="font-size: 3em; bottom: 6px;" />
      <strong class="bold-3">Haircut Challenge Tracker
      </strong>
    </div>

    <div
      class="row q-gutter-md"
      style="border-radius: 3px;"
      align="center"
    >

      <!-- -------------------- Before Hair -------------------- -->
      <q-card class="col">
        <div class="q-pa-md ">
          <strong class="bold-2">
            Before
          </strong>
          <hr>
        </div>

        <div class="container">
          <div class="wrapper">
            <!-- -------------------- Head -------------------- -->
            <div class="head_smiley">
              <!-- -------------------- Eyes -------------------- -->
              <div class="eyes">
                <div class="left"></div>
                <div class="right"></div>
              </div>
              <!-- -------------------- Mouth -------------------- -->
              <div class="mouth"></div>
            </div>

            <!-- -------------------- Hair -------------------- -->
            <div
              v-for="index in 250"
              :key="index"
              class="hair"
            >
            </div>

          </div>

          <br>
          <strong class="bold-1">
            250 hairs
          </strong>
          <br>
        </div>
      </q-card>
      <!-- -------------------- Current Hair -------------------- -->
      <q-card class="col">
        <div class="q-pa-md">
          <strong class="bold-2">
            Today
          </strong>
          <hr>
        </div>
        <div class="container">
          <div class="wrapper">
            <!-- -------------------- Head -------------------- -->
            <div class="head_smiley">
              <!-- -------------------- Eyes -------------------- -->
              <div class="eyes">
                <div class="left"></div>
                <div class="right"></div>
              </div>
              <!-- -------------------- Mouth -------------------- -->
              <div class="mouth"></div>
            </div>

            <!-- -------------------- Hair -------------------- -->
            <div
              v-for="index in hairCount"
              :key="index"
              class="hair"
            >
            </div>
            <!-- -------------------- Mouth -------------------- -->
            <div class="mouth"></div>
          </div>

          <br>
          <strong class="bold-1">
            {{ hairCount }} remaining
          </strong>
          <br>

        </div>
      </q-card>

      <!-- -------------------- Target Hair -------------------- -->
      <q-card class="col">
        <div class="q-pa-md">
          <strong class="bold-2">
            Goal
          </strong>
          <hr>
        </div>

        <div class="container">
          <div class="wrapper">
            <!-- -------------------- Head -------------------- -->
            <div class="head_smiley">
              <!-- -------------------- Eyes -------------------- -->
              <div class="eyes">
                <div class="left"></div>
                <div class="right"></div>
              </div>
              <!-- -------------------- Mouth -------------------- -->
              <div class="mouth"></div>
            </div>
            <!-- -------------------- Mouth -------------------- -->
            <div class="mouth"></div>
          </div>
          <br>

          <strong class="bold-1">
            0 hairs
          </strong>
          <br>
        </div>
      </q-card>

    </div>

    <div
      class="q-pa-md"
    >
    <br>
      <strong class="header">
        What is going on with Rabih's hair?
      </strong>
      <q-separator color="secondary" />
      <p class="q-mt-sm bold-1">
        Rabih Maalouf, VP of World Wide Engineering, promised to shave his head if we received at least 250 project submissions by Q1 of 2020. We track our progress by removing one hair for each project submitted. Our goal is to
        empower ALL EMPLOYEES to innovate - so go ahead and express your ingenuity - submit a project proposal and give Rabih a haircut.
      </p>
    </div>
  </div>
</template>

<script>
import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

export default {
  created () {
    this.loadFireRefs().then(res => {
      this.loadInformation()
    })
  },
  data () {
    return {
      db: null, // <Object>: firebase firestore credentials
      loading: true, // <Boolean>: flag for component loading animation
      hairCount: 250, // <Integer>: number for target
      projectList: [] // <Array<Object>>: list of visible projects from toc
    }
  },
  methods: {
    loadFireRefs: function () {
      /*
      // load firebase database reference
      // load firebase storage reference (if applicable)
      // load firebase cloud functions reference (if applicable)
      // params: <void>
      // return: <Promise<String>>
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
          return productionDb.collection('config').doc('project').get()
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
    loadInformation: function () {
      /*
      // load list of projects and challenges from the db
      // TODO: cache the projects and challenges with a timer
      // params: <void>
      // return: <Promise<Boolean>>
      */

      return this.db.collection('projects').doc('ToC').get().then(doc => {
        if (doc.exists) {
          for (let project in doc.data()) {
            if (project !== 'alias') {
              if (!doc.data()[project].hidden) {
                this.projectList.push(project)
              }
            }
          }

          return true
        } else {
          throw new Error('"projects/TOC" missing! (MainPageHairCut)')
        }
      }).then(() => {
        return this.db.collection('challenges').doc('ToC').get().then(doc => {
          if (doc.exists) {
            for (let challenge in doc.data()) {
              if (challenge !== 'alias') {
                if (!doc.data()[challenge].hidden) {
                  this.projectList.push(challenge)
                }
              }
            }
            this.hairCount = this.hairCount - this.projectList.length

            return true
          } else {
            throw new Error('"challenges/ToC" missing! (MainPageHairCut)')
          }
        })
      }).catch(err => {
        if (err) {
          setTimeout(() => {
            this.hairCount = this.hairCount - this.projectList.length
            this.loading = false
            return false
          }, 300)
        }
      })
    },
    doneLoading: function () {
      /*
      // stops the component from loading
      // params: <void>
      // return: <void>
      */

      this.loading = false
    }
  },
  watch: {
    hairCount: 'doneLoading'
  }
}
</script>

<style lang="stylus">
.bold-3 {
  font-size: 32px;
}

.bold-2 {
  font-size: 24px;
    color: #C00000;
}

.header {
  font-size: 24px;
}

.bold-1 {
  font-size: 18px;
}

.container{
  width: 100%;
  max-width: 1140px;
  overflow: hidden;
  /* margin-left: auto;
  margin-right: auto; */
}

.wrapper{
  width: 285px;
  /* height: 300px; */
  /* margin: 100px auto; */
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

.mouth_not_happy {
  width: 80px;
  height: -130px;
  border-top: -8px solid transparent;
  border-right: -8px solid transparent;
  border-left: -8px solid transparent;
  border-bottom: 8px solid #000;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  margin-left: auto;
  margin-right: auto;
}

.mouth_sad {
  width: 110px;
  height: -130px;
  border-top: -8px solid transparent;
  border-right: -8px solid transparent;
  border-left: -8px solid transparent;
  border-bottom: 8px solid #000;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  margin-left: auto;
  margin-right: auto;
}

.hair{
  width: 60px;
  height: 1px;
  background: #000;
  position: absolute;
  right: 24px;
  bottom: 20px;
  -webkit-transform: rotate(20deg);
  transform: rotate(20deg);
}

.hair {
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
  .hair:nth-of-type({i})
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
