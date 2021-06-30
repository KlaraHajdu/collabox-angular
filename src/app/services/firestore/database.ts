import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import { environment } from '../../../environments/environment';

const firebaseApp = firebase.initializeApp(environment.firebaseConfig)

const database = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

const checkIfAnalyticsIsSupported = async () => {
  const isSupported = await firebase.analytics.isSupported()
  if (isSupported) {
      firebase.analytics();
  }
}

checkIfAnalyticsIsSupported()

export { auth, provider }

export default database
