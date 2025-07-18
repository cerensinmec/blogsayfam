// Firebase hata mesajlarını Türkçe'ye çeviren fonksiyon
export const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.',
    'auth/wrong-password': 'Hatalı şifre girdiniz.',
    'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanımda.',
    'auth/weak-password': 'Şifre en az 6 karakter olmalıdır.',
    'auth/invalid-email': 'Geçersiz e-posta adresi.',
    'auth/too-many-requests': 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.',
    'auth/network-request-failed': 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
    'permission-denied': 'Bu işlem için yetkiniz bulunmuyor.',
    'unavailable': 'Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
    'not-found': 'Aradığınız veri bulunamadı.',
    'already-exists': 'Bu veri zaten mevcut.',
    'resource-exhausted': 'Kaynak tükenmiş. Lütfen daha sonra tekrar deneyin.',
    'failed-precondition': 'İşlem ön koşulları sağlanamadı.',
    'aborted': 'İşlem iptal edildi.',
    'out-of-range': 'Geçersiz değer aralığı.',
    'unimplemented': 'Bu özellik henüz uygulanmamış.',
    'internal': 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    'data-loss': 'Veri kaybı oluştu.',
    'unauthenticated': 'Kimlik doğrulama gerekli.',
    'default': 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  };

  return errorMessages[errorCode] || errorMessages['default'];
};

// Genel hata mesajı oluşturucu
export const createErrorMessage = (error, context = '') => {
  if (error?.code) {
    return getFirebaseErrorMessage(error.code);
  }
  
  if (error?.message) {
    return `${context} ${error.message}`.trim();
  }
  
  return `${context} Beklenmeyen bir hata oluştu.`.trim();
};

// Console'a hata loglama
export const logError = (error, context = '') => {
  console.error(`${context} Hata:`, error);
  
  // Production'da hata tracking servisi eklenebilir
  if (import.meta.env.PROD) {
    // Sentry, LogRocket gibi servisler buraya eklenebilir
    console.error('Production Error:', {
      context,
      error: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });
  }
};

// API hata kontrolü
export const handleApiError = (error, context = '') => {
  logError(error, context);
  
  if (error?.response?.status === 404) {
    return 'Aradığınız veri bulunamadı.';
  }
  
  if (error?.response?.status === 500) {
    return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
  }
  
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    return 'İstek hatası. Lütfen girdiğiniz bilgileri kontrol edin.';
  }
  
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
    return 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.';
  }
  
  return createErrorMessage(error, context);
}; 