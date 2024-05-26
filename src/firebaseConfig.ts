import * as admin from 'firebase-admin';
import * as serviceAccount from './FirebaseServiceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'beauty-duty.appspot.com'
});

const bucket = admin.storage().bucket();

export { bucket };
