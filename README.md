# BlogSayfam - Kişisel Blog Platformu

Modern React ve Firebase kullanarak geliştirilmiş, kullanıcı dostu bir blog platformu.

## 🚀 Özellikler

- **👤 Kullanıcı Yönetimi**: Kayıt olma, giriş yapma ve profil düzenleme
- **📝 Blog Sistemi**: Blog yazıları oluşturma, düzenleme ve paylaşma
- **📋 Not Alma**: Kişisel notlar oluşturma ve yönetme
- **👥 Kullanıcı Feed'i**: Diğer kullanıcıları keşfetme
- **🎨 Modern UI**: Material-UI ile responsive tasarım
- **🔥 Firebase Entegrasyonu**: Gerçek zamanlı veri senkronizasyonu
- **🛡️ Güvenlik**: Environment variables ile güvenli konfigürasyon
- **⚡ Performans**: Optimize edilmiş loading states ve error handling

## 🛠️ Teknolojiler

- **Frontend**: React 19, Vite
- **UI Framework**: Material-UI (MUI)
- **Backend**: Firebase (Firestore, Authentication)
- **Routing**: React Router DOM
- **Styling**: CSS3, Emotion

## 📦 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd blogsayfam
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment variables ayarlayın:**
   - Firebase Console'dan yeni proje oluşturun
   - Proje ayarlarından Firebase konfigürasyonunu alın
   - Kök dizinde `.env` dosyası oluşturun:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

## 🏗️ Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── LoadingSpinner.jsx  # Yükleme animasyonu
│   ├── ErrorBoundary.jsx   # Hata yakalama
│   └── AuthForm.jsx        # Kimlik doğrulama formu
├── pages/              # Sayfa bileşenleri
├── hooks/              # Custom React hooks
├── utils/              # Yardımcı fonksiyonlar
│   └── errorHandler.js # Hata yönetimi
├── services/           # API ve Firebase servisleri
├── layouts/            # Layout bileşenleri
├── theme/              # Material-UI tema ayarları
├── constants/          # Sabit veriler
└── firebase/           # Firebase yapılandırması
```

## 🎯 Kullanım

### Kullanıcı İşlemleri
- Header'daki "Giriş Yap" butonuna tıklayarak hesap oluşturun veya giriş yapın
- Giriş yaptıktan sonra profil bilgilerinizi düzenleyin
- Diğer kullanıcıları feed sayfasından keşfedin

### Blog Yazıları
- Blog sayfasından yeni yazı oluşturun
- Mevcut yazılarınızı düzenleyin
- Diğer kullanıcıların yazılarını okuyun

### Not Alma
- Notlar sayfasından kişisel notlarınızı oluşturun
- Notlarınızı düzenleyin ve silin

## 🔧 Geliştirme

### Scripts
```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run lint     # ESLint kontrolü
npm run preview  # Build önizleme
```

### Kod Standartları
- ESLint kurallarına uyun
- Component'leri küçük ve odaklanmış tutun
- Custom hook'lar kullanın
- Error handling için `utils/errorHandler.js` kullanın
- Loading states için `LoadingSpinner` component'ini kullanın

## 🚀 Deployment

1. **Production build oluşturun:**
```bash
npm run build
```

2. **Firebase Hosting'e deploy edin:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔒 Güvenlik

- Firebase API anahtarları environment variables ile korunur
- `.env` dosyası `.gitignore`'a eklenmiştir
- Hassas bilgiler asla kod içinde saklanmaz

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Ceren Sinmec** - [GitHub](https://github.com/cerensinmec)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
# Deployment tetikleme
