import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { createLogger } from '@/utils/logger';

const COLLECTION = 'legal_updates';
const log = createLogger('legalUpdatesService');

export const getLegalUpdates = async () => {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('createdAt', 'desc')));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    log.debug('Fetched legal updates', { count: data.length });
    return data;
  } catch (error) {
    log.error('Failed to fetch legal updates', { message: error.message });
    throw error;
  }
};

export const getLegalUpdateBySlug = async (slug) => {
  try {
    const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = { id: snap.docs[0].id, ...snap.docs[0].data() };
    log.debug('Fetched legal update by slug', { slug, id: data.id });
    return data;
  } catch (error) {
    log.error('Failed to fetch legal update by slug', { slug, message: error.message });
    throw error;
  }
};

export const createLegalUpdate = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    log.info('Created legal update', { id: ref.id, caseNumber: data.caseNumber });
    return ref.id;
  } catch (error) {
    log.error('Failed to create legal update', { caseNumber: data?.caseNumber, message: error.message });
    throw error;
  }
};

export const updateLegalUpdate = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
    log.info('Updated legal update', { id, caseNumber: data?.caseNumber });
  } catch (error) {
    log.error('Failed to update legal update', { id, message: error.message });
    throw error;
  }
};

export const deleteLegalUpdate = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    log.warn('Deleted legal update', { id });
  } catch (error) {
    log.error('Failed to delete legal update', { id, message: error.message });
    throw error;
  }
};

export const toggleStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
    log.info('Toggled legal update status', { id, status });
  } catch (error) {
    log.error('Failed to toggle legal update status', { id, status, message: error.message });
    throw error;
  }
};
