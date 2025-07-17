import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sampleUsers } from '../utils/sampleData';

export const fixBlogAuthors = async () => {
  try {
    console.log('🔧 Blog yazılarındaki yazar ID\'leri düzeltiliyor...');

    // Önce mevcut kullanıcıları al
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = {};
    usersSnapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });

    console.log('👥 Mevcut kullanıcılar:', Object.keys(users));

    // Blog yazılarını al
    const postsSnapshot = await getDocs(collection(db, 'blog-posts'));
    let fixedCount = 0;

    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      const currentAuthorId = postData.authorId;
      
      // Eğer authorId mevcut kullanıcılardan biriyse, güncelle
      if (users[currentAuthorId]) {
        console.log(`✅ Blog yazısı zaten doğru: "${postData.title}" (Yazar: ${postData.authorName})`);
        continue;
      }

      // AuthorId'yi düzelt - örnek verilerdeki eşleşmeyi bul
      const sampleUser = sampleUsers.find(user => user.displayName === postData.authorName);
      if (sampleUser && users[sampleUser.id]) {
        try {
          await updateDoc(doc(db, 'blog-posts', postDoc.id), {
            authorId: sampleUser.id
          });
          console.log(`✅ Blog yazısı düzeltildi: "${postData.title}" (Eski: ${currentAuthorId} → Yeni: ${sampleUser.id})`);
          fixedCount++;
        } catch (updateError) {
          console.error(`❌ Blog yazısı güncellenirken hata: "${postData.title}"`, updateError);
        }
      } else {
        console.log(`⚠️ Eşleşme bulunamadı: "${postData.title}" (Yazar: ${postData.authorName})`);
      }
    }

    console.log(`✅ Toplam ${fixedCount} blog yazısı düzeltildi!`);
    return { 
      success: true, 
      message: `${fixedCount} blog yazısı düzeltildi!` 
    };

  } catch (error) {
    console.error('❌ Blog yazıları düzeltilirken hata:', error);
    return { 
      success: false, 
      message: `Blog yazıları düzeltilirken hata oluştu: ${error.message}` 
    };
  }
}; 