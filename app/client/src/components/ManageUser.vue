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

Name:     components/ManageUser.vue
Purpose:
Methods:
  *

## -->

<template>

  <q-card class="q-pa-lg">
    <!-- ------------------ Main Content ------------------ -->
    <q-table
      wrap-cells
      color="secondary"
      row-key="email"
      :data="userList"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      :pagination.sync="pagination"
    >
      <template v-slot:top-left>
        <q-btn
          round
          icon="add" color="secondary"
          @click="dialog = true; dialogOption = 'add'"
        />
      </template>

      <template v-slot:top-right>
        <q-toolbar>
          <q-space />

          <q-input
            dense
            debounce="300" color="primary"
            placeholder="Search"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon
                v-if="filter === ''"
                name="search"
              />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="filter = ''"
              />
            </template>
          </q-input>
        </q-toolbar>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            style="font-size: 18px; font-weight: normal;"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td
            key="keywords"
            :props="props"
          >
            <div
              hidden
              align="left"
            >
            </div>
          </q-td>

          <q-td
            key="email"
            :props="props"
            style="width: 300px;"
          >
            <div align="left">
              {{ props.row.email }}
            </div>
          </q-td>

          <q-td
            key="uuid"
            :props="props"
          >
            <div>
              {{ props.row.uuid }}
            </div>
          </q-td>

          <q-td
            key="name"
            :props="props"
          >
            <div>
              {{ props.row.name }}
            </div>
          </q-td>

          <q-td
            key="icons"
            :props="props"
            style="width: 100px;"
          >
            <q-btn
              dense round flat
              color="secondary" icon="edit"
              @click="editUser(props.row.uuid || props.row.email)"
            />

            <q-btn
              dense round flat
              color="secondary" icon="delete"
              @click="deleteUser(props.row.uuid || props.row.email)"
            />
          </q-td>

        </q-tr>
      </template>

    </q-table>

    <q-dialog
      persistent maximized
      transition-show="slide-up" transition-hide="slide-down"
      v-model="dialog"
    >
      <q-card>
        <q-card-section v-if="dialogOption === 'add'" >
          <AddUser
            @added="updateUsers"
            @close="dialog = false"
          />
        </q-card-section>

        <q-card-section v-if="dialogOption === 'edit'" >
          <br>
          <EditUser
            :userId="userId"
            :emailList="emailList"
            @added="updateUsers"
            @close="dialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import productionDb from '../firebase/init_production'
import testingDb from '../firebase/init_testing'

import AddUser from '../components/SubmitUserAdminConsole'
import EditUser from '../components/EditUser'

export default {
  name: 'Manage_User',
  components: {
    AddUser,
    EditUser
  },
  created () {
    this.getDb().then(res => {
      this.getUsers()
      // this.columnsFont()
    })
  },
  data () {
    return {
      db: null,
      userId: '',
      dialog: false,
      dialogOption: '',
      userList: [],
      uuidList: [],
      emailList: [],
      filter: '',
      loading: true,
      pagination: {
        rowsPerPage: 5
      },
      columns: [
        {
          name: 'keywords',
          label: ''
        },
        {
          name: 'email',
          required: true,
          align: 'center',
          label: 'Email',
          field: row => row.email,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'uuid',
          label: 'UUID',
          align: 'center',
          field: row => row.uuid,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'center',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'icons',
          align: 'center',
          label: ''
        }
      ]
    }
  },
  methods: {
    editUser: function (entry) {
      this.dialogOption = 'edit'
      this.userId = entry
      setTimeout(() => {
        this.dialog = true
      }, 200)
    },
    getDb: function () {
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
          productionDb.collection('config').doc('project').get()
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
    getUsers: function () {
      this.db.collection('users').doc('ToC').get()
        .then(doc => {
          if (doc.exists) {
            let tocUserData = doc.data()
            for (let user in tocUserData) {
              this.userList.push(tocUserData[user])
              this.emailList.push(tocUserData[user].email)
              this.uuidList.push(user)
            }
          } else {
            /* console.log('No -ToC- document!') */
          }

          setTimeout(() => {
            this.loading = false
          }, 500)
        })
        .catch(error => {
          if (error) {
            /* console.log(error) */
          }
        })
    },
    deleteUser: function (entry) {
      this.$q.dialog({
        title: 'Confirmation to Delete',
        message: 'Delete ' + entry + '?',
        ok: true,
        cancel: true
      })
        .onOk(() => {
          if (this.userList.length < 1) {
            this.$q.dialog({
              title: 'Error',
              message: 'Nothing to remove!'
            })
          } else {
            if (this.uuidList.includes(entry)) {
              this.db.collection('users').doc(entry).delete()
                .then(() => {
                  this.$q.notify({
                    icon: 'done',
                    color: 'positive',
                    message: 'Deleted sucessfully!',
                    closeBtn: 'OK'
                  })
                })
                .catch(error => {
                  if (error) {
                    /* console.log(error) */
                  }
                })

              this.db.collection('users').doc('ToC').set({
                [entry]: firebase.firestore.FieldValue.delete()
              }, { merge: true })

              let tmpUserList = []

              this.userList.forEach(user => {
                if (user.email !== entry && user.uuid !== entry) {
                  tmpUserList.push(user)
                }
              })

              this.userList = tmpUserList
            } else {
              this.$q.dialog({
                title: 'Error',
                message: 'Email does not exist in the database.'
              })
            }
          }
        })
    },
    // columnsFont: function () {
    //   this.columns.forEach(entry => {
    //     entry.style = {
    //       fontSize: '18px',
    //       fontWeight: 'bold'
    //     }
    //   })
    // },
    updateUsers: function () {
      this.loading = true

      this.userList = []
      this.uuidList = []
      this.emailList = []

      this.getUsers()

      this.dialog = false
    }
  }
}
</script>

<style>

</style>
