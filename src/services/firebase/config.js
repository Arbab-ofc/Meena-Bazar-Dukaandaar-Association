import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA2TGoiu9_Nky_ORqhJYOtIAuPk-we1fJQ',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'meena-bazar-association.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'meena-bazar-association',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'meena-bazar-association.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '550677330949',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:550677330949:web:15c52243c92b434a1bf06c'
};

/*
Firestore rules intent:
- Public read: notices, legal_updates, team_members, members, documents, gallery (published/public entries)
- Public write: contact_submissions with strict field validation
- Admin read/write: admins and all management collections only for authenticated admins
*/

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
