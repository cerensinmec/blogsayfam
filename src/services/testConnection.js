import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Firebase bağlantısı test ediliyor...');
    
    // Basit bir sorgu yap
    const testCollection = collection(db, 'users');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firebase bağlantısı başarılı!');
    console.log(`📊 Koleksiyon boyutu: ${snapshot.size}`);
    
    return { 
      success: true, 
      message: 'Firebase bağlantısı başarılı!',
      data: {
        collectionSize: snapshot.size,
        documents: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }
    };
    
  } catch (error) {
    console.error('❌ Firebase bağlantı hatası:', error);
    
    // Hata türünü belirle
    let errorType = 'unknown';
    if (error.code === 'permission-denied') {
      errorType = 'permission';
    } else if (error.message.includes('CORS') || error.message.includes('CORB')) {
      errorType = 'cors';
    } else if (error.message.includes('network')) {
      errorType = 'network';
    }
    
    return { 
      success: false, 
      message: `Firebase bağlantı hatası: ${error.message}`,
      errorType: errorType,
      error: error
    };
  }
}; 