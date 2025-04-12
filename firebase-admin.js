const admin = require('firebase-admin');
const serviceAccount = require('./path-to-firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eduswap-142dc-default-rtdb.europe-west1.firebasedatabase.app"
});

const adminDb = admin.firestore();
const adminAuth = admin.auth();

module.exports = { adminDb, adminAuth };