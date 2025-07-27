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
  const followerIds = snapshot.docs.map(doc => doc.data().followerId);
  
  // Kullanıcı bilgilerini getir
  const usersRef = collection(db, 'users');
  
  const userPromises = followerIds.map(async (followerId) => {
    // Önce doküman ID'si ile kontrol et
    try {
      const userDocSnap = await getDocs(query(usersRef, where('__name__', '==', followerId)));
      
      if (!userDocSnap.empty) {
        const userData = userDocSnap.docs[0].data();
        
        // Kullanıcı adını oluştur: firstName + lastName veya username veya email
        const displayName = userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`.trim()
          : userData.username 
          ? userData.username
          : userData.email 
          ? userData.email.split('@')[0] // email'in @ öncesi kısmı
          : 'İsimsiz Kullanıcı';
        
        return {
          uid: followerId,
          displayName: displayName,
          username: userData.username,
          email: userData.email,
          photoURL: userData.photoURL || userData.profilePhoto || null
        };
      }
    } catch (error) {
      console.log('Error getting user by ID:', followerId, error);
    }
    
    // Fallback: uid alanı ile kontrol et
    const userDoc = await getDocs(query(usersRef, where('uid', '==', followerId)));
    
    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data();
      
      // Kullanıcı adını oluştur: firstName + lastName veya username veya email
      const displayName = userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}`.trim()
        : userData.username 
        ? userData.username
        : userData.email 
        ? userData.email.split('@')[0] // email'in @ öncesi kısmı
        : 'İsimsiz Kullanıcı';
      
      return {
        uid: followerId,
        displayName: displayName,
        username: userData.username,
        email: userData.email,
        photoURL: userData.photoURL || userData.profilePhoto || null
      };
    }
    
    return {
      uid: followerId,
      displayName: 'İsimsiz Kullanıcı',
      email: 'Bilinmeyen kullanıcı'
    };
  });
  
  return Promise.all(userPromises);
}

// Bir kullanıcının takip ettiklerini getir
export async function getFollowing(userId) {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where('followerId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const followingIds = snapshot.docs.map(doc => doc.data().followingId);
  
  // Kullanıcı bilgilerini getir
  const usersRef = collection(db, 'users');
  
  const userPromises = followingIds.map(async (followingId) => {
    // Önce doküman ID'si ile kontrol et
    try {
      const userDocSnap = await getDocs(query(usersRef, where('__name__', '==', followingId)));
      
      if (!userDocSnap.empty) {
        const userData = userDocSnap.docs[0].data();
        
        // Kullanıcı adını oluştur: firstName + lastName veya username veya email
        const displayName = userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`.trim()
          : userData.username 
          ? userData.username
          : userData.email 
          ? userData.email.split('@')[0] // email'in @ öncesi kısmı
          : 'İsimsiz Kullanıcı';
        
        return {
          uid: followingId,
          displayName: displayName,
          username: userData.username,
          email: userData.email,
          photoURL: userData.photoURL || userData.profilePhoto || null
        };
      }
    } catch (error) {
      console.log('Error getting user by ID:', followingId, error);
    }
    
    // Fallback: uid alanı ile kontrol et
    const userDoc = await getDocs(query(usersRef, where('uid', '==', followingId)));
    
    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data();
      
      // Kullanıcı adını oluştur: firstName + lastName veya username veya email
      const displayName = userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}`.trim()
        : userData.username 
        ? userData.username
        : userData.email 
        ? userData.email.split('@')[0] // email'in @ öncesi kısmı
        : 'İsimsiz Kullanıcı';
      
      return {
        uid: followingId,
        displayName: displayName,
        username: userData.username,
        email: userData.email,
        photoURL: userData.photoURL || userData.profilePhoto || null
      };
    }
    
    return {
      uid: followingId,
      displayName: 'İsimsiz Kullanıcı',
      email: 'Bilinmeyen kullanıcı'
    };
  });
  
  return Promise.all(userPromises);
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