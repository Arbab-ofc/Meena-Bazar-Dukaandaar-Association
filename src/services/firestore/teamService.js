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
  writeBatch
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';

const COLLECTION = 'team_members';

export const getTeamMembers = async () => {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('designationOrder', 'asc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    throw error;
  }
};

export const createMember = async (data) => {
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

export const updateMember = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    throw error;
  }
};

export const reorder = async (items) => {
  try {
    const batch = writeBatch(db);
    items.forEach((item, index) => {
      batch.update(doc(db, COLLECTION, item.id), {
        designationOrder: index + 1,
        updatedAt: serverTimestamp()
      });
    });
    await batch.commit();
  } catch (error) {
    throw error;
  }
};
