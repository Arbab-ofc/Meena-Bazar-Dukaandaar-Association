import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';

const COLLECTION = 'documents';

export const getDocuments = async () => {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    throw error;
  }
};

export const getDocumentsByCategory = async (category) => {
  try {
    if (!category || category === 'All') return getDocuments();
    const snap = await getDocs(
      query(collection(db, COLLECTION), where('category', '==', category), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    throw error;
  }
};

export const createDocument = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return ref.id;
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    throw error;
  }
};
