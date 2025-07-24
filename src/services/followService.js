import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const FOLLOWS_COLLECTION = 'follows';

// Bir kullanıcıyı takip et
export async function followUser(followerId, followingId) {
  if (followerId === followingId) throw new Error('Kendini takip edemezsin.');
  // Aynı ilişki var mı kontrol et
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  const existing = await getDocs(q);
  if (!existing.empty) return; // Zaten takipte
  await addDoc(collection(db, FOLLOWS_COLLECTION), {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });
}

// Bir kullanıcıyı takipten çık
export async function unfollowUser(followerId, followingId) {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  const snapshot = await getDocs(q);
  snapshot.forEach(async (docSnap) => {
    await deleteDoc(doc(db, FOLLOWS_COLLECTION, docSnap.id));
  });
}

// Bir kullanıcının takipçilerini getir
export async function getFollowers(userId) {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where('followingId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().followerId);
}

// Bir kullanıcının takip ettiklerini getir
export async function getFollowing(userId) {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where('followerId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().followingId);
}

// Bir kullanıcı diğerini takip ediyor mu?
export async function isFollowing(followerId, followingId) {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
} 