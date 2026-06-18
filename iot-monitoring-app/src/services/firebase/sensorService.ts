import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/firestore'; // 1. PASTIKAN BARIS INI ADA

const firebaseConfig = {
  apiKey: "AIzaSyBPov3sOpIqDcmUTFf7sJhXXnZKnRxtSoM",
  authDomain: "basrawok.firebaseapp.com",
  databaseURL: "https://basrawok-default-rtdb.firebaseio.com",
  projectId: "basrawok",
  storageBucket: "basrawok.firebasestorage.app",
  messagingSenderId: "445132381758",
  appId: "1:445132381758:web:7b35c6490bc201f7fffb6f",
  measurementId: "G-BKECE4W3GL"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const dataRef = firebase.database().ref();
export const dbFirestore = firebase.firestore(); // 2. PASTIKAN BARIS INI ADA