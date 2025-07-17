# BlogSayfam - Kişisel Blog Platformu

Modern React ve Firebase kullanarak geliştirilmiş, kullanıcı dostu bir blog platformu.

## 🚀 Özellikler

- **👤 Kullanıcı Yönetimi**: Kayıt olma, giriş yapma ve profil düzenleme
- **📝 Blog Sistemi**: Blog yazıları oluşturma, düzenleme ve paylaşma
- **📋 Not Alma**: Kişisel notlar oluşturma ve yönetme
- **👥 Kullanıcı Feed'i**: Diğer kullanıcıları keşfetme
- **🎨 Modern UI**: Material-UI ile responsive tasarım
- **🔥 Firebase Entegrasyonu**: Gerçek zamanlı veri senkronizasyonu

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

3. **Firebase yapılandırması:**
   - Firebase Console'dan yeni proje oluşturun
   - `src/firebase/config.js` dosyasını kendi Firebase ayarlarınızla güncelleyin

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

## 🏗️ Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── pages/              # Sayfa bileşenleri
├── hooks/              # Custom React hooks
├── utils/              # Yardımcı fonksiyonlar
├── services/           # API ve Firebase servisleri
├── layouts/            # Layout bileşenleri
├── theme/              # Material-UI tema ayarları
├── constants/          # Sabit veriler
└── firebase/           # Firebase yapılandırması
```

## 🎯 Kullanım

### Kullanıcı İşlemleri
- Ana sayfadan "Kayıt Ol" butonuna tıklayarak hesap oluşturun
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
- TypeScript kullanımı önerilir

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

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Ceren Sinmec** - [GitHub](https://github.com/cerensinmec)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
