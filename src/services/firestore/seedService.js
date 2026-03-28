import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { SEED_LEGAL_UPDATES, SEED_TEAM_MEMBERS } from '@/data/seedData';
import { slugify } from '@/utils/slugify';

const isCollectionEmpty = async (collectionName) => {
  const snapshot = await getDocs(query(collection(db, collectionName), limit(1)));
  return snapshot.empty;
};

const seedTeamMembers = async () => {
  if (!(await isCollectionEmpty('team_members'))) return;

  await Promise.all(
    SEED_TEAM_MEMBERS.map((member) =>
      setDoc(doc(db, 'team_members', member.id), {
        ...member,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    )
  );
};

const seedLegalUpdates = async () => {
  if (!(await isCollectionEmpty('legal_updates'))) return;

  await Promise.all(
    SEED_LEGAL_UPDATES.map((item) => {
      const createdAt =
        typeof item.createdAt?.seconds === 'number'
          ? new Date(item.createdAt.seconds * 1000)
          : serverTimestamp();

      return setDoc(doc(db, 'legal_updates', item.id), {
        ...item,
        slug: item.slug || slugify(item.title),
        createdAt,
        updatedAt: serverTimestamp()
      });
    })
  );
};

export const seedInitialDataToDb = async () => {
  await Promise.all([seedTeamMembers(), seedLegalUpdates()]);
};
