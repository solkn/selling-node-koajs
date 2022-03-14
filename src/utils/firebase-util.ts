import * as admin from 'firebase-admin';
import serviceAccount from '../../secrets/optimum-level-firebase-adminsdk-aahs2-926d5effb5';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://optimum-level.firebaseio.com'
});

export const firebaseAdmin = admin;
