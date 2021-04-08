import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { environment } from '../../../environments/environment';

const firebaseApp = firebase.initializeApp(environment.firebaseConfig)

const database = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }

export default database
