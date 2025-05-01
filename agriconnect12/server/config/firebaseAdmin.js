const admin = require('firebase-admin');
const serviceAccount = require('./agriconnect-68cd0-firebase-adminsdk-fbsvc-8d90a4991c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };