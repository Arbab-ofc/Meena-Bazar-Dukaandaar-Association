import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';

const COLLECTION = 'contact_submissions';

export const submitContact = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return ref.id;
  } catch (error) {
    throw error;
  }
};

export const getSubmissions = async () => {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    throw error;
  }
};

export const deleteSubmission = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    throw error;
  }
};
