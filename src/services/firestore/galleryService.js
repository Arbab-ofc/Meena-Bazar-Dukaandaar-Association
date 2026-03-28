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

const COLLECTION = 'gallery';

export const getGalleryItems = async () => {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('eventDate', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    throw error;
  }
};

export const getByCategory = async (category) => {
  try {
    if (!category || category === 'All') return getGalleryItems();
    const snap = await getDocs(
      query(collection(db, COLLECTION), where('category', '==', category), orderBy('eventDate', 'desc'))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    throw error;
  }
};

export const createItem = async (data) => {
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

export const updateItem = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    throw error;
  }
};
