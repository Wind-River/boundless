/* This file is responsible for large database interactions or grouping mutations */

import productionDb from '../../firebase/init_production'

import { LocalStorage } from 'quasar'

/**
 * Sets up the firebase reference getter.
 *
 * @export
 * @param {*} { commit } Allows action to commit mutations.
 * @returns {Boolean} Whether there is an error.
 */
export async function loadFireRefs ({ commit }) {
  if (LocalStorage.has('boundless_db')) {
    let sessionDb = LocalStorage.getItem('boundless_db')
    // loading firebase references
    commit('setIsTestingDb', sessionDb === 'testing')

    return true
  } else {
    try {
      let doc = await productionDb.collection('config').doc('project').get()

      if (doc.exists) {
        if (doc.data().db === 'testing') {
          commit('setIsTestingDb', true)
          LocalStorage.set('boundless_db', 'testing')
        } else {
          commit('setIsTestingDb', false)
          LocalStorage.set('boundless_db', 'production')
        }
      } else {
        let msg = '"/config/project" path does not exists!'
        throw new Error(msg)
      }

      return true
    } catch (error) {
      commit('setIsTestingDb', false)
      LocalStorage.set('boundless_db', 'production')

      return false
    }
  }
}

/**
  * Load the config from the db.
  * TODO: this should be replaced now that config/project
  *       is cached in session
  *
  * @param {*} { commit, getters } Allows this action to
  *  commit mutations and retrieve state.
  * @return {Promise<Boolean>}
  */
export async function loadConfig ({ commit, getters }) {
  try {
    let doc = await getters.db.collection('config').doc('project').get()

    if (doc.exists) {
      let data = doc.data()
      let keywordOptions = []
      for (let key in data['keywords']) {
        keywordOptions.push({
          label: key,
          value: data['keywords'][key]
        })
      }
      commit('setKeywordOptions', keywordOptions)
      commit('setQuestionTemplates', data.projectsConfig.questionTemplates)
      commit('setAllowedDomain', data.allowedDomain)
      commit('setBodyTypeOptions', data.bodyContentType)
      commit('setChipTypeOptions', data.chipContentType)

      return true
    }
    throw new Error('Required document not found!')
  } catch (error) {
    throw new Error(error)
  }
}

/**
  * load the user list from the db and store the data into component state
  * @param {*} { commit, getters } Allows this action to
  *  commit mutations and retrieve state.
  * @return {Promise<Boolean>} Whether or not there was an error.
  */
export async function loadUserList ({ commit, getters }) {
  try {
    let doc = await getters.db.collection('users').doc('ToC').get()

    if (doc.exists) {
      let tocUserData = doc.data()
      let emailToUuidMap = {}
      let emailToNameMap = {}
      for (let uuid in tocUserData) {
        emailToUuidMap[tocUserData[uuid].email] = uuid
        emailToNameMap[tocUserData[uuid].email] = tocUserData[uuid].name
      }

      commit('setEmailToUuidMap', emailToUuidMap)
      commit('setEmailToNameMap', emailToNameMap)
      return true
    }

    throw new Error('users/ToC not found!')
  } catch (error) {
    return false
  }
}

/**
 * Submits the new users related to the project as the user submits
 * the project to the database.
 *
 * @export
 * @param {*} { commit, getters } Allows this action to
 *  commit mutations and retrieve state.
 */
export async function submitNewUsers ({ commit, getters }) {
  try {
    getters.projectMembers.forEach(async (member) => {
      if (!(member.email in getters.emailToUuidMap)) {
        let timeOfSubmit = new Date(Date.now()).toISOString()
        let userDoc = getters.db.collection('users').doc()
        let uuid = userDoc.id

        let newUser = {
          uuid,
          name: member.name,
          email: member.email,
          title: '',
          imgURL: '',
          timestamp: timeOfSubmit,
          created: timeOfSubmit
        }

        commit('addEntryToEmailToUuidMap', {
          email: newUser.email,
          uuid
        })
        commit('addEntryToEmailToNameMap', {
          email: newUser.email,
          name: newUser.name
        })

        await getters.db.collection('users').doc(uuid).set({
          socialNetwork: {},
          projects: [],
          achievements: {}
        })

        await getters.db.collection('users').doc('ToC').set({
          [uuid]: newUser
        }, { merge: true })
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Submits the project to the database once all the required fields are checked.
 * Creates the new users who are not in the db, and notifies
 * the user on both success and failure.
 * Unlike most other fields, the project id, submission time and users list
 * are finalized in here instead of in ProjectMainForm.vue
 *
 * @export
 * @param {*} { commit, dispatch, getters } Allows action to get from the
 *  vuex store, commit mutations, and dispatch other actions.
 */
export async function submitProject ({ commit, dispatch, getters }) {
  try {
    await dispatch('submitNewUsers')

    let tmpMembers = []
    getters.projectMembers.forEach(member => {
      tmpMembers.push({
        uuid: getters.emailToUuidMap[member.email],
        role: member.role
      })
    })
    commit('setSubmittedProjectMembers', tmpMembers)

    // create a reference to a new project in the db
    let projectDoc = getters.db.collection('projects').doc()
    let submitTime = new Date(Date.now()).toISOString()

    commit('setProjectUuid', projectDoc.id)
    commit('setProjectSubmitTime', submitTime)

    await projectDoc.set({
      webpage: getters.webpage,
      files: {}
    })
    await getters.db.collection('projects').doc('ToC').set({
      [getters.projectUuid]: getters.project
    }, { merge: true })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Save custom form responses under a field named 'createInfo'.
 *
 * @export
 * @param {*} { commit, getters } Allows this action to
 *  commit mutations and retrieve state.
 */
export async function submitQuestions ({ commit, getters }) {
  try {
    let uuid = getters.projectUuid
    let projectDoc = getters.db.collection('projects').doc(uuid)
    await projectDoc.update({
      customFormResponse: getters.questions
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Save questionTemplates to vuex and into Firestore.
 *
 * @export
 * @param {*} { commit, getters } Allows this action to
 *  commit mutations and retrieve state.
 * @param {Array<Object>} questionTemplates The new state of questionTemplates.
 */
export async function submitQuestionTemplates ({ commit, getters }, questionTemplates) {
  try {
    await getters.db.collection('config')
      .doc('project')
      .update({
        'projectsConfig.questionTemplates': questionTemplates
      })
    commit('setQuestionTemplates', questionTemplates)
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Helper function which resets the vuex store to the initial state.
 *
 * @export
 * @param {*} { commit } Allows this action to commit mutations
 */
export function resetProject ({ commit }) {
  commit('setProject', {
    uuid: null,
    name: '',
    description: '',
    members: [],
    keywords: [],
    timestamp: null,
    created: null,
    progress: 0,
    hidden: false,
    alias: ''
  })
  commit('setProjectMembers', [{
    name: '',
    email: '',
    role: 'lead'
  }])
  commit('setWebpage', {
    imgURL: '',
    chips: [],
    body: []
  })
}
