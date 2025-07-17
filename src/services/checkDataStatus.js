import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const checkCurrentDataStatus = async () => {
  try {
    console.log('🔍 Mevcut veri durumu kontrol ediliyor...');
    
    // Users koleksiyonunu kontrol et
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`👥 Users koleksiyonu: ${usersSnapshot.size} kullanıcı`);
    usersSnapshot.forEach(doc => {
      console.log(`   - ${doc.id}: ${doc.data().displayName || doc.data().name || 'İsimsiz'}`);
    });
    
    // Blog-posts koleksiyonunu kontrol et
    const postsSnapshot = await getDocs(collection(db, 'blog-posts'));
    console.log(`📝 Blog-posts koleksiyonu: ${postsSnapshot.size} yazı`);
    postsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${doc.id}: "${data.title}" (Yazar: ${data.authorName}, AuthorID: ${data.authorId})`);
    });
    
    // Likes koleksiyonunu kontrol et
    const likesSnapshot = await getDocs(collection(db, 'likes'));
    console.log(`❤️ Likes koleksiyonu: ${likesSnapshot.size} beğeni`);
    
    // Comments koleksiyonunu kontrol et
    const commentsSnapshot = await getDocs(collection(db, 'comments'));
    console.log(`💬 Comments koleksiyonu: ${commentsSnapshot.size} yorum`);
    
    return {
      users: usersSnapshot.size,
      posts: postsSnapshot.size,
      likes: likesSnapshot.size,
      comments: commentsSnapshot.size
    };
    
  } catch (error) {
    console.error('❌ Veri durumu kontrol edilirken hata:', error);
    return { users: 0, posts: 0, likes: 0, comments: 0 };
  }
}; 