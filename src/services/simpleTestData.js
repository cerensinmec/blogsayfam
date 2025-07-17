import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const createSimpleTestData = async () => {
  try {
    console.log('Basit test verisi oluşturuluyor...');

    // Basit bir blog yazısı ekle
    const testPost = await addDoc(collection(db, 'blog-posts'), {
      title: 'Test Blog Yazısı',
      content: 'Bu bir test blog yazısıdır. Örnek veriler başarıyla yüklendi!',
      category: 'test',
      authorId: 'test-user-123',
      authorName: 'Test Kullanıcı',
      authorPhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likeCount: 5,
      commentCount: 2
    });

    console.log('✅ Test blog yazısı oluşturuldu:', testPost.id);
    
    // Basit bir kullanıcı profili ekle
    const testUser = await addDoc(collection(db, 'users'), {
      displayName: 'Test Kullanıcı',
      email: 'test@example.com',
      bio: 'Bu bir test kullanıcısıdır.',
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      school: 'Test Üniversitesi',
      birthPlace: 'Test Şehri',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Test kullanıcısı oluşturuldu:', testUser.id);
    
    return { 
      success: true, 
      message: `Test verisi başarıyla oluşturuldu! Blog ID: ${testPost.id}, Kullanıcı ID: ${testUser.id}` 
    };

  } catch (error) {
    console.error('❌ Test verisi oluşturulurken hata:', error);
    return { 
      success: false, 
      message: `Test verisi oluşturulurken hata: ${error.message}` 
    };
  }
}; 