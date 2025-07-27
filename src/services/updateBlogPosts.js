import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Mevcut blog yazılarına totalReadingTime alanı ekle
export const updateExistingBlogPosts = async () => {
  try {
    console.log('Blog yazıları güncelleniyor...');
    
    const blogPostsRef = collection(db, 'blog-posts');
    const snapshot = await getDocs(blogPostsRef);
    
    let updatedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const postData = docSnapshot.data();
      
      // Eğer totalReadingTime alanı yoksa ekle
      if (postData.totalReadingTime === undefined) {
        await updateDoc(doc(db, 'blog-posts', docSnapshot.id), {
          totalReadingTime: 0
        });
        updatedCount++;
        console.log(`Blog yazısı güncellendi: ${docSnapshot.id}`);
      }
    }
    
    console.log(`Toplam ${updatedCount} blog yazısı güncellendi.`);
    return updatedCount;
    
  } catch (error) {
    console.error('Blog yazıları güncellenirken hata:', error);
    throw error;
  }
};

// Test fonksiyonu
export const testUpdate = async () => {
  try {
    const count = await updateExistingBlogPosts();
    console.log(`✅ ${count} blog yazısı başarıyla güncellendi!`);
    return count;
  } catch (error) {
    console.error('❌ Güncelleme hatası:', error);
    throw error;
  }
}; 