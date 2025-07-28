# BlogSayfam - Modern Blog ve Sosyal Platform

Modern React 19 ve Firebase kullanarak geliştirilmiş, kullanıcı dostu bir blog ve sosyal platform. Kullanıcılar blog yazıları paylaşabilir, birbirleriyle etkileşime geçebilir ve gerçek zamanlı mesajlaşma yapabilir.

## 🚀 Özellikler

### 👤 Kullanıcı Yönetimi
- **Kayıt ve Giriş**: Güvenli Firebase Authentication
- **Profil Yönetimi**: Profil fotoğrafı, bio ve kişisel bilgiler
- **Kullanıcı Takibi**: Diğer kullanıcıları takip etme/takibi bırakma
- **Profil Görüntüleme**: Detaylı kullanıcı profilleri

### 📝 Blog Sistemi
- **Blog Yazıları**: Zengin içerikli blog yazıları oluşturma
- **Markdown Desteği**: Markdown formatında yazı yazma
- **Resim Yükleme**: Blog yazılarına resim ekleme
- **Düzenleme**: Mevcut blog yazılarını düzenleme
- **Silme**: Blog yazılarını silme
- **Okuma Süresi**: Otomatik okuma süresi hesaplama

### 🎨 Gelişmiş UI/UX
- **Modern Tasarım**: Material-UI ile responsive tasarım
- **Türkiye Haritası**: İnteraktif Türkiye haritası bileşeni
- **Emoji Picker**: Emoji seçici entegrasyonu
- **Loading States**: Yükleme animasyonları
- **Error Handling**: Kapsamlı hata yönetimi
- **Responsive**: Mobil ve masaüstü uyumlu

### 💬 Mesajlaşma Sistemi
- **Gerçek Zamanlı Chat**: Firebase ile anlık mesajlaşma
- **Konuşma Listesi**: Aktif konuşmaları görüntüleme
- **Emoji Desteği**: Mesajlarda emoji kullanımı
- **Okundu Durumu**: Mesaj okundu bildirimleri

### 🔍 Keşfetme ve Sosyal Özellikler
- **Feed Sayfası**: Diğer kullanıcıların blog yazıları
- **Aktif Yazarlar**: Popüler yazarları görüntüleme
- **İlgili Yazılar**: Benzer içerik önerileri
- **Paylaşım Butonları**: Sosyal medya paylaşımları
- **Takipçi Sistemi**: Takipçi ve takip edilen listesi

### 🛡️ Güvenlik ve Performans
- **Firebase Güvenliği**: Güvenli veri yönetimi
- **Environment Variables**: Güvenli konfigürasyon
- **Error Boundaries**: Uygulama hata yönetimi
- **Optimized Loading**: Performans optimizasyonu

## 🛠️ Teknolojiler

### Frontend
- **React 19**: En son React sürümü
- **Vite**: Hızlı build tool
- **Material-UI (MUI)**: UI component library
- **React Router DOM**: Sayfa yönlendirme
- **Emotion**: CSS-in-JS styling

### Backend & Veritabanı
- **Firebase**: Backend as a Service
- **Firestore**: NoSQL veritabanı
- **Firebase Authentication**: Kullanıcı kimlik doğrulama
- **Firebase Storage**: Dosya depolama

### Geliştirme Araçları
- **ESLint**: Kod kalitesi
- **Prettier**: Kod formatlama
- **TypeScript**: Tip kontrolü (opsiyonel)

## 📦 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd blogsayfam
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Firebase Konfigürasyonu
1. [Firebase Console](https://console.firebase.google.com/)'dan yeni proje oluşturun
2. Authentication, Firestore Database ve Storage servislerini etkinleştirin
3. Web uygulaması ekleyin ve konfigürasyon bilgilerini alın
4. Kök dizinde `.env` dosyası oluşturun:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama `http://localhost:5173` (veya müsait olan port) adresinde çalışacaktır.

## 🏗️ Proje Yapısı

```
src/
├── components/              # Yeniden kullanılabilir bileşenler
│   ├── AuthForm.jsx         # Kimlik doğrulama formu
│   ├── BlogPostCard.jsx     # Blog yazısı kartı
│   ├── BlogPosts.jsx        # Blog yazıları listesi
│   ├── ChatWindow.jsx       # Mesajlaşma penceresi
│   ├── ConversationList.jsx # Konuşma listesi
│   ├── Header.jsx           # Sayfa başlığı
│   ├── ImageUpload.jsx      # Resim yükleme
│   ├── MarkdownRenderer.jsx # Markdown renderer
│   ├── TurkeyMap.jsx        # Türkiye haritası
│   └── ...
├── pages/                   # Sayfa bileşenleri
│   ├── HomePage.jsx         # Ana sayfa
│   ├── FeedPage.jsx         # Feed sayfası
│   ├── BlogDetailPage.jsx   # Blog detay sayfası
│   ├── BlogEditPage.jsx     # Blog düzenleme
│   ├── UserProfilePage.jsx  # Kullanıcı profili
│   ├── MessagesPage.jsx     # Mesajlar sayfası
│   └── ...
├── hooks/                   # Custom React hooks
│   ├── useAuth.js           # Kimlik doğrulama hook'u
│   └── useReadingTime.js    # Okuma süresi hook'u
├── services/                # API servisleri
│   └── followService.js     # Takip servisi
├── firebase/                # Firebase yapılandırması
│   └── config.js
├── theme/                   # Material-UI tema
│   └── theme.jsx
├── utils/                   # Yardımcı fonksiyonlar
│   └── errorHandler.js
└── constants/               # Sabit veriler
    └── data/
        ├── cityCenters.js   # Şehir koordinatları
        └── cityPaths.js     # Şehir yolları
```

## 🎯 Kullanım Kılavuzu

### Kullanıcı Hesabı
1. **Kayıt Olma**: Ana sayfada "Kayıt Ol" butonuna tıklayın
2. **Giriş Yapma**: Email ve şifre ile giriş yapın
3. **Profil Düzenleme**: Header'dan profil ayarlarına erişin

### Blog Yazıları
1. **Yeni Yazı**: "Blog Yaz" butonuna tıklayın
2. **Markdown Kullanımı**: Zengin içerik için Markdown syntax'ı kullanın
3. **Resim Ekleme**: Resim yükleme butonunu kullanın
4. **Yayınlama**: "Yayınla" butonuna tıklayın

### Sosyal Özellikler
1. **Feed Keşfi**: Feed sayfasından diğer yazıları okuyun
2. **Kullanıcı Takibi**: Profil sayfalarından takip edin
3. **Mesajlaşma**: Messages sayfasından sohbet başlatın

## 🔧 Geliştirme

### Mevcut Scripts
```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run preview      # Build önizleme
npm run lint         # ESLint kontrolü
npm run lint:fix     # ESLint otomatik düzeltme
npm run format       # Prettier formatlama
npm run type-check   # TypeScript tip kontrolü
```

### Kod Standartları
- **ESLint**: Kod kalitesi kurallarına uyun
- **Prettier**: Otomatik kod formatlama
- **Component Yapısı**: Küçük ve odaklanmış bileşenler
- **Custom Hooks**: Tekrar eden mantık için hook'lar
- **Error Handling**: ErrorBoundary kullanımı

### Yeni Özellik Ekleme
1. Component'i `src/components/` altında oluşturun
2. Sayfa bileşenini `src/pages/` altında oluşturun
3. Gerekirse custom hook'u `src/hooks/` altında oluşturun
4. Routing'i `App.jsx`'te tanımlayın

## 🚀 Deployment

### Firebase Hosting'e Deploy

1. **Firebase CLI Kurulumu:**
```bash
npm install -g firebase-tools
```

2. **Firebase'e Giriş:**
```bash
firebase login
```

3. **Proje Başlatma:**
```bash
firebase init hosting
```

4. **Production Build:**
```bash
npm run build
```

5. **Deploy:**
```bash
firebase deploy
```

### Environment Variables
Production'da environment variables'ları Firebase Hosting'de ayarlayın:
- Firebase Console > Project Settings > Environment Configuration

## 🔒 Güvenlik

- **API Anahtarları**: Environment variables ile korunur
- **Firebase Rules**: Firestore ve Storage güvenlik kuralları
- **Authentication**: Firebase Auth ile güvenli kimlik doğrulama
- **Input Validation**: Kullanıcı girdilerinin doğrulanması

## 📱 Responsive Tasarım

- **Mobile First**: Mobil öncelikli tasarım
- **Breakpoints**: Material-UI breakpoint sistemi
- **Touch Friendly**: Dokunmatik cihaz uyumlu
- **Progressive Web App**: PWA özellikleri

## 🐛 Hata Ayıklama

### Yaygın Sorunlar
1. **Firebase Bağlantı Hatası**: Environment variables'ları kontrol edin
2. **Resim Yükleme Hatası**: Firebase Storage kurallarını kontrol edin
3. **Authentication Hatası**: Firebase Auth ayarlarını kontrol edin

### Debug Araçları
- **React Developer Tools**: Component debugging
- **Firebase Console**: Veritabanı ve authentication monitoring
- **Browser DevTools**: Network ve console hataları

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Ceren Sinmec** - [GitHub](https://github.com/cerensinmec)

## 🙏 Teşekkürler

- **Material-UI**: UI component library
- **Firebase**: Backend servisleri
- **React Community**: Açık kaynak katkıları
- **Vite**: Hızlı build tool

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 