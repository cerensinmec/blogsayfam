import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { sampleUsers, samplePosts, sampleLikes, sampleComments } from '../utils/sampleData';

export const loadSampleData = async () => {
  try {
    console.log('Örnek veriler yükleniyor...');

    // Firebase bağlantısını test et
    try {
      await getDocs(collection(db, 'users'));
      console.log('Firebase bağlantısı başarılı');
    } catch (connectionError) {
      console.error('Firebase bağlantı hatası:', connectionError);
      return { 
        success: false, 
        message: 'Firebase bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin.' 
      };
    }

    // Önce mevcut verileri kontrol et
    const existingUsers = await getDocs(collection(db, 'users'));
    const existingPosts = await getDocs(collection(db, 'blog-posts'));

    console.log(`Mevcut kullanıcı sayısı: ${existingUsers.size}`);
    console.log(`Mevcut blog yazısı sayısı: ${existingPosts.size}`);

    // Eğer veri varsa yükleme
    if (!existingUsers.empty || !existingPosts.empty) {
      console.log('Veriler zaten mevcut. Yükleme atlanıyor.');
      return { success: false, message: 'Veriler zaten mevcut.' };
    }

    // Kullanıcıları yükle
    console.log('Kullanıcılar yükleniyor...');
    const userRefs = {};
    for (const user of sampleUsers) {
      try {
        console.log(`Kullanıcı yükleniyor: ${user.displayName} (ID: ${user.id})`);
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, {
          ...user,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        userRefs[user.id] = userRef;
        console.log(`✅ Kullanıcı yüklendi: ${user.displayName}`);
      } catch (userError) {
        console.error(`❌ Kullanıcı yüklenirken hata (${user.displayName}):`, userError);
        throw new Error(`Kullanıcı yüklenirken hata: ${user.displayName}`);
      }
    }

    // Blog yazılarını yükle
    console.log('Blog yazıları yükleniyor...');
    const postRefs = {};
    for (const post of samplePosts) {
      try {
        console.log(`Blog yazısı yükleniyor: ${post.title} (Yazar: ${post.authorName})`);
        const postRef = doc(db, 'blog-posts', post.id);
        await setDoc(postRef, {
          ...post,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          likeCount: post.likeCount || 0,
          commentCount: post.commentCount || 0
        });
        postRefs[post.id] = postRef;
        console.log(`✅ Blog yazısı yüklendi: ${post.title} (ID: ${post.id})`);
      } catch (postError) {
        console.error(`❌ Blog yazısı yüklenirken hata (${post.title}):`, postError);
        throw new Error(`Blog yazısı yüklenirken hata: ${post.title}`);
      }
    }

    // Beğenileri yükle
    console.log('Beğeniler yükleniyor...');
    for (const like of sampleLikes) {
      try {
        const postRef = postRefs[like.postId];
        if (postRef) {
          await addDoc(collection(db, 'likes'), {
            postId: postRef.id,
            userId: like.userId,
            userEmail: sampleUsers.find(u => u.id === like.userId)?.email,
            userName: like.userName,
            createdAt: serverTimestamp()
          });
        }
      } catch (likeError) {
        console.error('Beğeni yüklenirken hata:', likeError);
        // Beğeni hatası kritik değil, devam et
      }
    }

    // Yorumları yükle
    console.log('Yorumlar yükleniyor...');
    for (const comment of sampleComments) {
      try {
        const postRef = postRefs[comment.postId];
        if (postRef) {
          await addDoc(collection(db, 'comments'), {
            postId: postRef.id,
            userId: comment.userId,
            userEmail: sampleUsers.find(u => u.id === comment.userId)?.email,
            userName: comment.userName,
            content: comment.content,
            createdAt: serverTimestamp()
          });
        }
      } catch (commentError) {
        console.error('Yorum yüklenirken hata:', commentError);
        // Yorum hatası kritik değil, devam et
      }
    }

    console.log('✅ Örnek veriler başarıyla yüklendi!');
    console.log(`📊 Yüklenen veriler:`);
    console.log(`   - ${sampleUsers.length} kullanıcı`);
    console.log(`   - ${samplePosts.length} blog yazısı`);
    console.log(`   - ${sampleLikes.length} beğeni`);
    console.log(`   - ${sampleComments.length} yorum`);
    
    return { success: true, message: 'Örnek veriler başarıyla yüklendi!' };

  } catch (error) {
    console.error('❌ Örnek veriler yüklenirken hata:', error);
    return { 
      success: false, 
      message: `Veriler yüklenirken hata oluştu: ${error.message}` 
    };
  }
};

export const clearAllData = async () => {
  try {
    console.log('Tüm veriler siliniyor...');

    // Kullanıcıları sil
    const usersSnapshot = await getDocs(collection(db, 'users'));
    for (const userDoc of usersSnapshot.docs) {
      await userDoc.ref.delete();
    }

    // Blog yazılarını sil
    const postsSnapshot = await getDocs(collection(db, 'blog-posts'));
    for (const postDoc of postsSnapshot.docs) {
      await postDoc.ref.delete();
    }

    // Beğenileri sil
    const likesSnapshot = await getDocs(collection(db, 'likes'));
    for (const likeDoc of likesSnapshot.docs) {
      await likeDoc.ref.delete();
    }

    // Yorumları sil
    const commentsSnapshot = await getDocs(collection(db, 'comments'));
    for (const commentDoc of commentsSnapshot.docs) {
      await commentDoc.ref.delete();
    }

    console.log('Tüm veriler silindi!');
    return { success: true, message: 'Tüm veriler silindi!' };

  } catch (error) {
    console.error('Veriler silinirken hata:', error);
    return { success: false, message: 'Veriler silinirken hata oluştu: ' + error.message };
  }
};

export const checkDataExists = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const postsSnapshot = await getDocs(collection(db, 'blog-posts'));
    
    return {
      hasUsers: !usersSnapshot.empty,
      hasPosts: !postsSnapshot.empty,
      userCount: usersSnapshot.size,
      postCount: postsSnapshot.size
    };
  } catch (error) {
    console.error('Veri kontrolü sırasında hata:', error);
    return { hasUsers: false, hasPosts: false, userCount: 0, postCount: 0 };
  }
}; 