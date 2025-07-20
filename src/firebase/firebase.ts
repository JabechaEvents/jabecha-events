import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAOJ4i59LEJ44X2NUrV_MRU9phQaWmF8KE',
  authDomain: 'jabechaevents-d00d7.firebaseapp.com',
  projectId: 'jabechaevents-d00d7',
  storageBucket: 'jabechaevents-d00d7.appspot.com',
  messagingSenderId: '861350259078',
  appId: '1:861350259078:web:3c5a552252fc30b0fd6407',
  measurementId: 'G-K4BPVGMYP5',
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app; 