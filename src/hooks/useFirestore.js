import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

export const useFirestore = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const constraints = [];

    if (options.where) {
      options.where.forEach((item) => constraints.push(where(item.field, item.op, item.value)));
    }

    if (options.orderBy) {
      constraints.push(orderBy(options.orderBy.field, options.orderBy.direction || 'desc'));
    }

    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, JSON.stringify(options)]);

  return { data, loading, error };
};
