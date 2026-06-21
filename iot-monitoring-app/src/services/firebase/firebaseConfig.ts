import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // 1. Tambahkan import ini

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

// Pastikan urutan baris di bawah ini benar dan menggunakan kata 'export'
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app); // 2. Tambahkan export ini untuk Realtime Database