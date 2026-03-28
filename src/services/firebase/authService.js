import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { createLogger } from '@/utils/logger';

const log = createLogger('authService');

export const signUp = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    log.info('Sign-up successful', { uid: result.user?.uid, email });
    return result;
  } catch (error) {
    log.error('Sign-up failed', { email, message: error.message });
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    log.info('Sign-in successful', { uid: result.user?.uid, email });
    return result;
  } catch (error) {
    log.error('Sign-in failed', { email, message: error.message });
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    log.info('Sign-out successful');
  } catch (error) {
    log.error('Sign-out failed', { message: error.message });
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    log.info('Password reset email sent', { email });
  } catch (error) {
    log.error('Password reset failed', { email, message: error.message });
    throw error;
  }
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthStateChanged = (callback) =>
  firebaseOnAuthStateChanged(auth, (user) => {
    log.debug('Auth state changed', { uid: user?.uid || null });
    callback(user);
  });
