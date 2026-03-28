import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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

const COLLECTION = 'notices';
const normalizeStatus = (status) => (String(status || '').toLowerCase() === 'published' ? 'published' : 'draft');
const log = createLogger('noticesService');

export const getNotices = async (status) => {
  try {
    const clauses = [collection(db, COLLECTION)];
    if (status) clauses.push(where('status', '==', status));
    clauses.push(orderBy('createdAt', 'desc'));
    const snap = await getDocs(query(...clauses));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    log.debug('Fetched notices', { count: data.length, statusFilter: status || null });
    return data;
  } catch (error) {
    log.error('Failed to fetch notices', { statusFilter: status || null, message: error.message });
    throw error;
  }
};

export const getPublishedNotices = async (limitCount = 20) => {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const data = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((item) => normalizeStatus(item.status) === 'published')
      .slice(0, limitCount);
    log.debug('Fetched published notices', { count: data.length, limit: limitCount });
    return data;
  } catch (error) {
    log.error('Failed to fetch published notices', { limit: limitCount, message: error.message });
    throw error;
  }
};

export const getNoticeBySlug = async (slug) => {
  try {
    const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = { id: snap.docs[0].id, ...snap.docs[0].data() };
    log.debug('Fetched notice by slug', { slug, id: data.id });
    return data;
  } catch (error) {
    log.error('Failed to fetch notice by slug', { slug, message: error.message });
    throw error;
  }
};

export const getNoticeById = async (id) => {
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    const data = { id: snap.id, ...snap.data() };
    log.debug('Fetched notice by id', { id });
    return data;
  } catch (error) {
    log.error('Failed to fetch notice by id', { id, message: error.message });
    throw error;
  }
};

export const createNotice = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      status: normalizeStatus(data.status),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    log.info('Created notice', { id: ref.id, status: normalizeStatus(data.status) });
    return ref.id;
  } catch (error) {
    log.error('Failed to create notice', { message: error.message });
    throw error;
  }
};

export const updateNotice = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      status: normalizeStatus(data.status),
      updatedAt: serverTimestamp()
    });
    log.info('Updated notice', { id, status: normalizeStatus(data.status) });
  } catch (error) {
    log.error('Failed to update notice', { id, message: error.message });
    throw error;
  }
};

export const deleteNotice = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    log.warn('Deleted notice', { id });
  } catch (error) {
    log.error('Failed to delete notice', { id, message: error.message });
    throw error;
  }
};

export const toggleStatus = async (id, currentStatus) => {
  try {
    const nextStatus = normalizeStatus(currentStatus) === 'published' ? 'draft' : 'published';
    await updateDoc(doc(db, COLLECTION, id), { status: nextStatus, updatedAt: serverTimestamp() });
    log.info('Toggled notice status', { id, from: normalizeStatus(currentStatus), to: nextStatus });
    return nextStatus;
  } catch (error) {
    log.error('Failed to toggle notice status', { id, currentStatus, message: error.message });
    throw error;
  }
};

export const getFeaturedNotices = async (limitCount = 1) => {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const data = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((item) => item.featured === true && normalizeStatus(item.status) === 'published')
      .slice(0, limitCount);
    log.debug('Fetched featured notices', { count: data.length, limit: limitCount });
    return data;
  } catch (error) {
    log.error('Failed to fetch featured notices', { limit: limitCount, message: error.message });
    throw error;
  }
};

// Index required: notices(status ASC, createdAt DESC), notices(status ASC, featured ASC, createdAt DESC)
