import { database } from '../firebase/config';
import { ref, set, get, push } from 'firebase/database';

export const updateRealtimeDatabaseBlogPosts = async () => {
  try {
    console.log('Realtime Database blog yazıları güncelleniyor...');
    
    // Mevcut blog yazılarının ID'leri (console'dan aldığımız ID'ler)
    const existingBlogPosts = {
      'rlooFTk6uvClcGxT8iRq': { // Önceki test postu
        title: 'Mevcut Blog Yazısı',
        content: 'Bu blog yazısı Firestore\'da mevcut',
        authorId: 'SOMd0v6HAucUnjnyYrxj6p9y8bu2',
        totalReadingTime: 0,
        createdAt: Date.now()
      },
      'EFKJaXCzPvyjUsGuQfh5': { // Yeni test postu (Kapadokya yazısı)
        title: '3 Günde Kapadokya: Balonlar, Testi Kebabı ve Ayaklarımın İsyanı',
        content: 'Kapadokya mı? Aşırı turistik diyorlardı ama ben bayıldım!',
        authorId: 'AY3bMvXMFIX3brZK4ynEEgwlg7D3',
        totalReadingTime: 0,
        createdAt: Date.now()
      }
    };

    for (const [postId, postData] of Object.entries(existingBlogPosts)) {
      const postRef = ref(database, `blog-posts/${postId}`);
      const snapshot = await get(postRef);
      
      if (snapshot.exists()) {
        const existingData = snapshot.val();
        const updatedData = {
          ...existingData,
          ...postData,
          totalReadingTime: existingData.totalReadingTime || 0
        };
        await set(postRef, updatedData);
        console.log(`Blog yazısı güncellendi: ${postId}`);
      } else {
        await set(postRef, postData);
        console.log(`Yeni blog yazısı oluşturuldu: ${postId}`);
      }
    }
    console.log('Tüm blog yazıları Realtime Database\'e başarıyla eklendi!');
    return true;
  } catch (error) {
    console.error('Realtime Database güncelleme hatası:', error);
    return false;
  }
};

export const listRealtimeBlogPosts = async () => {
  try {
    console.log('Realtime Database blog yazıları listeleniyor...');
    const postsRef = ref(database, 'blog-posts');
    const snapshot = await get(postsRef);
    
    if (snapshot.exists()) {
      const posts = snapshot.val();
      console.log('Realtime Database blog yazıları:', posts);
      return posts;
    } else {
      console.log('Realtime Database\'de blog yazısı bulunamadı');
      return null;
    }
  } catch (error) {
    console.error('Realtime Database listeleme hatası:', error);
    return null;
  }
};

export const resetReadingTime = async (postId) => {
  try {
    const readingTimeRef = ref(database, `blog-posts/${postId}/totalReadingTime`);
    await set(readingTimeRef, 0);
    console.log(`${postId} için okuma süresi sıfırlandı`);
    return true;
  } catch (error) {
    console.error('Okuma süresi sıfırlama hatası:', error);
    return false;
  }
};

export const resetAllReadingTimes = async () => {
  try {
    const postsRef = ref(database, 'blog-posts');
    const snapshot = await get(postsRef);
    
    if (snapshot.exists()) {
      const posts = snapshot.val();
      for (const postId of Object.keys(posts)) {
        await resetReadingTime(postId);
      }
      console.log('Tüm okuma süreleri sıfırlandı');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Tüm okuma sürelerini sıfırlama hatası:', error);
    return false;
  }
}; 