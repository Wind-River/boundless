import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

import { firebaseConfigs } from '../../boundless.config'

// Your web app's Firebase configuration
let firebaseConfig = firebaseConfigs.testing
// Initialize Firebase
const firebaseAppTesting = firebase.initializeApp(firebaseConfig, 'secondary')

// export const testingAuth = firebaseAppTesting.auth()
export const testingStorage = firebaseAppTesting.storage()

// Initializing Firebase Cloud Functions for testingDb
export const testAppCall = firebaseAppTesting.functions()

// Export firebase to be used in other parts of the application
export default firebaseAppTesting.firestore()
// export default firebaseAppTesting.database()
