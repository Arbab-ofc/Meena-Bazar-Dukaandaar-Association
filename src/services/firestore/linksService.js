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

const COLLECTION = 'links';

export const getLinks = async () => {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy('createdAt', 'desc')));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const getPublishedLinks = async () => {
  const snap = await getDocs(query(collection(db, COLLECTION), where('status', '==', 'published')));
  return snap.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
};

export const createLink = async (data) => {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
};

export const updateLink = async (id, data) => {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteLink = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
