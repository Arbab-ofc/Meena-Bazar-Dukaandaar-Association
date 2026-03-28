import { createContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from '@/services/firebase/authService';
import { verifyAdmin } from '@/services/firestore/adminService';

export const AuthContext = createContext({
  user: null,
  adminData: null,
  isAdmin: false,
  isLoading: true,
  error: null,
  signOut: async () => {}
});

/** @param {{children: import('react').ReactNode}} props */
export const AuthContextProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    adminData: null,
    isAdmin: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const unsubscribe = onAuthStateChanged(async (user) => {
      if (!user) {
        setState({ user: null, adminData: null, isAdmin: false, isLoading: false, error: null });
        return;
      }

      try {
        let admin = null;
        for (let attempt = 0; attempt < 4; attempt += 1) {
          admin = await verifyAdmin(user.uid);
          if (admin) break;
          await wait(300);
        }

        if (!admin) {
          await signOut();
          setState({
            user: null,
            adminData: null,
            isAdmin: false,
            isLoading: false,
            error: 'Access denied. Not an authorized admin.'
          });
          return;
        }

        setState({ user, adminData: admin, isAdmin: true, isLoading: false, error: null });
      } catch (error) {
        setState({ user: null, adminData: null, isAdmin: false, isLoading: false, error: error.message });
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setState({ user: null, adminData: null, isAdmin: false, isLoading: false, error: null });
  };

  const value = useMemo(() => ({ ...state, signOut: handleSignOut }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
