const admin = require('firebase-admin');

if (!admin.apps.length) {
  // Use Application Default Credentials. For local development, set
  // GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON file stored
  // outside this repository. Never commit that file.
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

module.exports = { admin, db };
