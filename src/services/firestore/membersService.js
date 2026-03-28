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
import { createLogger } from '@/utils/logger';

const COLLECTION = 'members';
const log = createLogger('membersService');

export const getMembers = async () => {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('displayOrder', 'asc')));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    log.debug('Fetched members', { count: data.length });
    return data;
  } catch (error) {
    log.error('Failed to fetch members', { message: error.message });
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
    log.info('Created member', { id: ref.id, shopNumber: data.shopNumber });
    return ref.id;
  } catch (error) {
    log.error('Failed to create member', { shopNumber: data?.shopNumber, message: error.message });
    throw error;
  }
};

export const updateMember = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
    log.info('Updated member', { id, shopNumber: data?.shopNumber });
  } catch (error) {
    log.error('Failed to update member', { id, message: error.message });
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    log.warn('Deleted member', { id });
  } catch (error) {
    log.error('Failed to delete member', { id, message: error.message });
    throw error;
  }
};

export const searchMembers = async (term) => {
  try {
    const all = await getMembers();
    const q = term.toLowerCase();
    const data = all.filter(
      (item) =>
        item.shopName?.toLowerCase().includes(q) ||
        item.ownerName?.toLowerCase().includes(q) ||
        item.shopNumber?.toLowerCase().includes(q)
    );
    log.debug('Searched members', { term, count: data.length });
    return data;
  } catch (error) {
    log.error('Failed to search members', { term, message: error.message });
    throw error;
  }
};
