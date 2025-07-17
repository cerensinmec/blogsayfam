import { db } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sampleUsers } from '../utils/sampleData';

export const addUsersOnly = async () => {
  try {
    console.log('👥 Sadece kullanıcılar ekleniyor...');

    // Kullanıcıları yükle
    const userRefs = {};
    for (const user of sampleUsers) {
      try {
        console.log(`Kullanıcı ekleniyor: ${user.displayName} (ID: ${user.id})`);
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, {
          ...user,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        userRefs[user.id] = userRef;
        console.log(`✅ Kullanıcı eklendi: ${user.displayName}`);
      } catch (userError) {
        console.error(`❌ Kullanıcı eklenirken hata (${user.displayName}):`, userError);
        throw new Error(`Kullanıcı eklenirken hata: ${user.displayName}`);
      }
    }

    console.log('✅ Tüm kullanıcılar başarıyla eklendi!');
    console.log(`📊 Eklenen kullanıcılar:`);
    sampleUsers.forEach(user => {
      console.log(`   - ${user.id}: ${user.displayName}`);
    });
    
    return { 
      success: true, 
      message: `${sampleUsers.length} kullanıcı başarıyla eklendi!` 
    };

  } catch (error) {
    console.error('❌ Kullanıcılar eklenirken hata:', error);
    return { 
      success: false, 
      message: `Kullanıcılar eklenirken hata oluştu: ${error.message}` 
    };
  }
}; 