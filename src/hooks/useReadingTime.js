import { useState, useEffect, useRef } from 'react';
import { auth, database, db } from '../firebase/config';
import { ref, set, get, increment, onValue, off } from 'firebase/database';
import { doc, updateDoc, increment as firestoreIncrement } from 'firebase/firestore';

const useReadingTime = (contentRef, postId) => {
  const [readingTime, setReadingTime] = useState(0);
  const [totalReadingTime, setTotalReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const startTimeRef = useRef(null);
  const lastActivityRef = useRef(null);
  const readingTimerRef = useRef(null);
  const sessionStartTimeRef = useRef(null);
  const isReadingRef = useRef(false); // isReading durumunu ref ile takip et

  // Toplam okuma süresini Realtime Database'den getir
  const fetchTotalReadingTime = async () => {
    if (!postId) return;
    
    try {
      console.log('🔍 Toplam okuma süresi getiriliyor...', postId);
      const readingTimeRef = ref(database, `blog-posts/${postId}/totalReadingTime`);
      console.log('📍 Realtime Database path:', `blog-posts/${postId}/totalReadingTime`);
      
      const snapshot = await get(readingTimeRef);
      console.log('📊 Snapshot exists:', snapshot.exists());
      console.log('📊 Snapshot value:', snapshot.val());
      
      if (snapshot.exists()) {
        const totalTime = snapshot.val() || 0;
        console.log('✅ Toplam okuma süresi:', totalTime);
        setTotalReadingTime(totalTime);
      } else {
        console.log('❌ Okuma süresi verisi bulunamadı, 0 olarak ayarlanıyor');
        setTotalReadingTime(0);
      }
    } catch (error) {
      console.error('❌ Toplam okuma süresi getirilemedi:', error);
      setTotalReadingTime(0);
    }
  };

  // Realtime listener ekle
  useEffect(() => {
    if (!postId) return;

    const readingTimeRef = ref(database, `blog-posts/${postId}/totalReadingTime`);
    
    const unsubscribe = onValue(readingTimeRef, (snapshot) => {
      if (snapshot.exists()) {
        const totalTime = snapshot.val() || 0;
        console.log('Realtime güncelleme - Toplam okuma süresi:', totalTime);
        setTotalReadingTime(totalTime);
      }
    });

    return () => {
      off(readingTimeRef, unsubscribe);
    };
  }, [postId]);

  // Okuma süresini hem Firestore hem Realtime Database'e kaydet
  const saveReadingTime = async (duration) => {
    if (!postId || duration < 5) return; // 5 saniyeden az süreleri kaydetme
    
    try {
      console.log('Okuma süresi kaydediliyor:', duration, 'saniye');
      
      // 1. Firestore'a kaydet (blog yazısına özel)
      const postRef = doc(db, 'blog-posts', postId);
      await updateDoc(postRef, {
        totalReadingTime: firestoreIncrement(duration)
      });
      console.log('Firestore\'a kaydedildi:', duration, 'saniye');
      
      // 2. Realtime Database'e kaydet (gerçek zamanlı gösterim için)
      const readingTimeRef = ref(database, `blog-posts/${postId}/totalReadingTime`);
      await set(readingTimeRef, increment(duration));
      console.log('Realtime Database\'e kaydedildi:', duration, 'saniye');
      
      console.log(`${duration} saniye okuma süresi başarıyla kaydedildi`);
    } catch (error) {
      console.error('Okuma süresi kaydedilemedi:', error);
    }
  };

  // Okuma aktivitesini tespit et
  const detectReadingActivity = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    
    console.log('🎯 Okuma aktivitesi tespit edildi');
    console.log('📊 Mevcut isReading:', isReading);
    
    if (!isReadingRef.current) {
      console.log('✅ isReading false\'dan true\'ya değiştiriliyor');
      setIsReading(true);
      isReadingRef.current = true;
      startTimeRef.current = now;
      sessionStartTimeRef.current = now;
      console.log('✅ sessionStartTimeRef ayarlandı:', now);
    }
    
    // Kullanıcı sayfada kaldığı sürece okuma devam eder
  };

  // Scroll pozisyonunu takip et
  const handleScroll = () => {
    if (!contentRef.current) return;
    
    const element = contentRef.current;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Scroll progress'ini hesapla (0-100)
    const scrollProgress = Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100);
    setProgress(scrollProgress);
    
    detectReadingActivity();
  };

  // Mouse hareketlerini takip et
  const handleMouseMove = () => {
    detectReadingActivity();
  };

  // Klavye hareketlerini takip et
  const handleKeyPress = () => {
    detectReadingActivity();
  };

  // Sayfa kapatıldığında süreyi kaydet
  const handleBeforeUnload = () => {
    if (isReadingRef.current && sessionStartTimeRef.current) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      if (sessionDuration > 5) {
        console.log('🚪 Sayfa kapatılıyor, okuma süresi kaydediliyor:', sessionDuration, 'saniye');
        saveReadingTime(sessionDuration);
      }
    }
  };

  // Okuma süresini güncelle ve her dakika kaydet
  useEffect(() => {
    if (isReading) {
      readingTimerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setReadingTime(elapsed);
        }
        
        // Her saniye dakika kontrolü yap
        const saveReadingTimeEveryMinute = async () => {
          console.log('🔍 Dakika kontrolü yapılıyor...');
          console.log('📊 isReadingRef.current:', isReadingRef.current);
          console.log('📊 sessionStartTimeRef.current:', sessionStartTimeRef.current);
          
          if (isReadingRef.current && sessionStartTimeRef.current) {
            const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
            console.log('📊 Session duration:', sessionDuration, 'saniye');
            
            if (sessionDuration >= 60) { // 60 saniye (1 dakika) geçtiyse
              console.log('🕐 1 dakika geçti, okuma süresi kaydediliyor...');
              await saveReadingTime(60); // 60 saniye kaydet
              sessionStartTimeRef.current = Date.now(); // Yeni dakika için sıfırla
              console.log('✅ Yeni dakika için sessionStartTimeRef sıfırlandı');
            } else {
              console.log('⏳ Henüz 1 dakika geçmedi:', 60 - sessionDuration, 'saniye kaldı');
            }
          } else {
            console.log('❌ Okuma aktif değil veya sessionStartTimeRef yok');
          }
        };
        
        saveReadingTimeEveryMinute();
      }, 1000);
    } else {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current);
      }
    }

    return () => {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current);
      }
    };
  }, [isReading]);

  // Event listener'ları ekle
  useEffect(() => {
    const element = contentRef.current;
    console.log('🎯 Event listener useEffect çalıştı');
    console.log('📊 contentRef.current:', element);
    
    if (!element) {
      console.log('❌ contentRef.current null, event listener eklenmedi');
      return;
    }

    console.log('✅ Event listener\'lar ekleniyor...');
    element.addEventListener('scroll', handleScroll);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('keydown', handleKeyPress);
    
    // Touch events için
    element.addEventListener('touchstart', detectReadingActivity);
    element.addEventListener('touchmove', detectReadingActivity);

    // Sayfa kapatıldığında süreyi kaydet
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.log('🧹 Event listener\'lar temizleniyor...');
      element.removeEventListener('scroll', handleScroll);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('keydown', handleKeyPress);
      element.removeEventListener('touchstart', detectReadingActivity);
      element.removeEventListener('touchmove', detectReadingActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [contentRef.current]); // contentRef.current dependency'si eklendi

  // Sayfa değiştiğinde sıfırla ve toplam süreyi getir
  useEffect(() => {
    // Önceki sayfadaki okuma süresini kaydet
    if (isReadingRef.current && sessionStartTimeRef.current) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      if (sessionDuration > 5) {
        console.log('📄 Sayfa değişiyor, okuma süresi kaydediliyor:', sessionDuration, 'saniye');
        saveReadingTime(sessionDuration);
      }
    }
    
    // Yeni sayfa için sıfırla
    setReadingTime(0);
    setProgress(0);
    setIsReading(false);
    isReadingRef.current = false;
    startTimeRef.current = null;
    lastActivityRef.current = null;
    sessionStartTimeRef.current = null;
    
    // Toplam okuma süresini getir
    fetchTotalReadingTime();
  }, [postId]);

  // Dakika formatına çevir
  const formatReadingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} saniye`;
    } else if (remainingSeconds === 0) {
      return `${minutes} dakika`;
    } else {
      return `${minutes} dk ${remainingSeconds} sn`;
    }
  };

  // Toplam süreyi formatla
  const formatTotalReadingTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} saat ${minutes} dakika`;
    } else {
      return `${minutes} dakika`;
    }
  };

  return {
    readingTime,
    totalReadingTime,
    isReading,
    progress,
    formatReadingTime,
    formatTotalReadingTime,
    startReading: () => {
      setIsReading(true);
      startTimeRef.current = Date.now();
      sessionStartTimeRef.current = Date.now();
    },
    stopReading: () => {
      if (isReading && sessionStartTimeRef.current) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        if (sessionDuration > 5) {
          saveReadingTime(sessionDuration);
        }
      }
      setIsReading(false);
    },

  };
};

export default useReadingTime; 