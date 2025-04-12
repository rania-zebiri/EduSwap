// For Firebase Client SDK (Frontend)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAS8z9R1np8vcoIXGyEHQDPgpdSNlJyOPw",
  authDomain: "eduswap-142dc.firebaseapp.com",
  databaseURL: "https://eduswap-142dc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eduswap-142dc",
  storageBucket: "eduswap-142dc.firebasestorage.app",
  messagingSenderId: "875282442068",
  appId: "1:875282442068:web:b683363bf790dca4414ac1",
  measurementId: "G-D9EGWS1N3Q"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, auth, db, collection };