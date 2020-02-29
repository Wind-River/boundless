import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

import { firebaseConfigs } from '../../boundless.config'

// Your web app's Firebase configuration
let firebaseConfig = firebaseConfigs.production

// Initialize Firebase
const firebaseAppProduction = firebase.initializeApp(firebaseConfig)

// export const auth = firebaseAppProduction.auth()
export const productionStorage = firebaseAppProduction.storage()

// Initializing Firebase Cloud Functions for testingDb
export const proAppCall = firebaseAppProduction.functions()

// Export firebase to be used in other parts of the application
export default firebaseAppProduction.firestore()
