import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyATSFcetD_Gzn-pRxDIpuQ1pXbkz6BGGVI",
  authDomain: "blogsayfam-c9289.firebaseapp.com",
  projectId: "blogsayfam-c9289",
  storageBucket: "blogsayfam-c9289.firebasestorage.app",
  messagingSenderId: "879615162088",
  appId: "1:879615162088:web:35114222e29bee23dc7b5d",
  measurementId: "G-MBCL8BY3X6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Geliştirme ortamında CORS sorunlarını önlemek için
if (process.env.NODE_ENV === 'development') {
  // CORS ayarları
  console.log('Development modunda Firebase bağlantısı kuruluyor...');
}

export default app; 