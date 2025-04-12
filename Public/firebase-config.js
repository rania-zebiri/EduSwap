const firebaseConfig = {
    apiKey: "AIzaSyAS8z9R1np8vcoIXGyEHQDPgpdSNlJyOPw",
    authDomain: "eduswap-142dc.firebaseapp.com",
    databaseURL: "https://eduswap-142dc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "eduswap-142dc",
    storageBucket: "eduswap-142dc.appspot.com",
    messagingSenderId: "875282442068",
    appId: "1:875282442068:web:b683363bf790dca4414ac1",
    measurementId: "G-D9EGWS1N3Q"
  };
  
 
  const app = firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  const functions = firebase.functions(); 
  
  
  db.enablePersistence()
    .catch((err) => {
      console.error("Firebase offline persistence error:", err);
    });
  
  
  export { app, auth, db, functions };