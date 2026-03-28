import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';

const COLLECTION = 'admins';

export const verifyAdmin = async (uid) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('uid', '==', uid),
      where('isActive', '==', true),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (error) {
    throw error;
  }
};

export const getAdmin = async (uid) => {
  try {
    return await verifyAdmin(uid);
  } catch (error) {
    throw error;
  }
};

export const checkAdminStatus = async (uid) => {
  try {
    const admin = await verifyAdmin(uid);
    return Boolean(admin);
  } catch (error) {
    throw error;
  }
};

export const updateAdmin = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const createAdminProfile = async ({ uid, name, email, role = 'Admin' }) => {
  try {
    await setDoc(doc(db, COLLECTION, uid), {
      uid,
      name,
      email,
      role,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};
