// Örnek kullanıcı verileri
export const sampleUsers = [
  {
    id: 'user1',
    email: 'ayse.yilmaz@example.com',
    displayName: 'Ayşe Yılmaz',
    bio: 'Teknoloji tutkunu, yazılım geliştirici ve seyahat edebiyatı hayranı. İstanbul\'da yaşıyorum ve yeni teknolojileri keşfetmeyi seviyorum.',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    school: 'İstanbul Teknik Üniversitesi',
    birthPlace: 'İstanbul',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'user2',
    email: 'mehmet.kaya@example.com',
    displayName: 'Mehmet Kaya',
    bio: 'Gastronomi tutkunu, yemek blogu yazarı ve aşçılık eğitmeni. Geleneksel Türk mutfağını modern tekniklerle birleştirmeyi seviyorum.',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    school: 'Marmara Üniversitesi',
    birthPlace: 'Antalya',
    createdAt: new Date('2024-02-20')
  },
  {
    id: 'user3',
    email: 'zeynep.demir@example.com',
    displayName: 'Zeynep Demir',
    bio: 'Seyahat tutkunu, fotoğrafçı ve hikaye anlatıcısı. Dünyayı keşfetmeyi ve insanların hikayelerini paylaşmayı seviyorum.',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    school: 'Boğaziçi Üniversitesi',
    birthPlace: 'İzmir',
    createdAt: new Date('2024-03-10')
  },
  {
    id: 'user4',
    email: 'ali.ozturk@example.com',
    displayName: 'Ali Öztürk',
    bio: 'Eğitim teknolojileri uzmanı ve eğitimci. Dijital çağda eğitimin nasıl dönüştüğünü araştırıyorum ve deneyimlerimi paylaşıyorum.',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    school: 'Ankara Üniversitesi',
    birthPlace: 'Ankara',
    createdAt: new Date('2024-01-30')
  },
  {
    id: 'user5',
    email: 'fatma.sahin@example.com',
    displayName: 'Fatma Şahin',
    bio: 'Yaşam koçu, motivasyon konuşmacısı ve kişisel gelişim yazarı. İnsanların potansiyellerini keşfetmelerine yardım ediyorum.',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    school: 'Hacettepe Üniversitesi',
    birthPlace: 'Bursa',
    createdAt: new Date('2024-02-15')
  }
];

// Örnek blog yazıları
export const samplePosts = [
  {
    id: 'post1',
    title: 'React 19 ile Gelen Yeni Özellikler',
    content: `React 19'un yeni sürümü ile birlikte gelen heyecan verici özellikler hakkında konuşalım. Bu sürümde performans iyileştirmeleri, yeni hook'lar ve daha iyi geliştirici deneyimi sunuluyor.

Özellikle dikkat çeken yenilikler:
- Concurrent Features'ın stabil hale gelmesi
- Yeni use() hook'u
- Gelişmiş error boundary'ler
- Daha hızlı render performansı

Bu değişiklikler modern web uygulamaları geliştirirken bize daha fazla esneklik sağlıyor. Özellikle büyük ölçekli projelerde bu iyileştirmelerin farkını hissedeceğiz.`,
    category: 'teknoloji',
    authorId: 'user1',
    authorName: 'Ayşe Yılmaz',
    createdAt: new Date('2024-12-15T10:30:00'),
    likeCount: 24,
    commentCount: 8
  },
  {
    id: 'post2',
    title: 'Geleneksel Türk Mutfağından Modern Tarifler',
    content: `Türk mutfağının zengin lezzetlerini modern mutfak teknikleriyle birleştirerek yeni tarifler oluşturuyorum. Bu yazımda size geleneksel mantı tarifini nasıl güncelleyebileceğinizi göstereceğim.

Malzemeler:
- 500g un
- 300g kıyma
- 1 adet soğan
- Baharatlar

Hazırlanışı oldukça basit ama lezzeti muhteşem. Özellikle sos kısmında kullandığımız yoğurt sosu tarifi çok beğenildi.`,
    category: 'yemek',
    authorId: 'user2',
    authorName: 'Mehmet Kaya',
    createdAt: new Date('2024-12-14T15:45:00'),
    likeCount: 42,
    commentCount: 15
  },
  {
    id: 'post3',
    title: 'Kapadokya\'da 3 Günlük Macera',
    content: `Kapadokya'nın büyülü atmosferinde geçirdiğim 3 günlük seyahat deneyimimi sizlerle paylaşmak istiyorum. Balon turundan yeraltı şehirlerine kadar her anı unutulmazdı.

İlk gün: Göreme Açık Hava Müzesi
İkinci gün: Balon turu ve Ihlara Vadisi
Üçüncü gün: Yeraltı şehirleri ve çömlek yapımı

Bu seyahat bana Türkiye'nin ne kadar zengin bir kültüre sahip olduğunu bir kez daha hatırlattı. Her köşesinde yeni bir hikaye, yeni bir lezzet var.`,
    category: 'seyahat',
    authorId: 'user3',
    authorName: 'Zeynep Demir',
    createdAt: new Date('2024-12-13T09:20:00'),
    likeCount: 67,
    commentCount: 23
  },
  {
    id: 'post4',
    title: 'Dijital Çağda Eğitimin Geleceği',
    content: `Eğitim teknolojilerinin hızla geliştiği bu dönemde, öğretmenlerin ve öğrencilerin nasıl adapte olması gerektiğini tartışalım. Yapay zeka, sanal gerçeklik ve online eğitim platformları eğitimi nasıl dönüştürüyor?

Önemli noktalar:
- Hibrit eğitim modelleri
- Kişiselleştirilmiş öğrenme
- Teknoloji entegrasyonu
- Öğretmen eğitimi

Bu değişim sürecinde en önemli şey, teknolojinin eğitimin yerini alması değil, onu desteklemesi olduğunu unutmamak.`,
    category: 'eğitim',
    authorId: 'user4',
    authorName: 'Ali Öztürk',
    createdAt: new Date('2024-12-12T14:15:00'),
    likeCount: 31,
    commentCount: 12
  },
  {
    id: 'post5',
    title: 'Günlük Rutinlerin Gücü',
    content: `Başarılı insanların ortak özelliklerinden biri güçlü günlük rutinlere sahip olmaları. Bu yazımda size kendi deneyimlerimden yola çıkarak oluşturduğum sabah rutinimi paylaşacağım.

Sabah rutinim:
- 06:00 - Erken uyanış
- 06:15 - Meditasyon ve nefes egzersizleri
- 06:30 - Sağlıklı kahvaltı
- 07:00 - Günlük planlama
- 07:30 - İşe başlangıç

Bu rutin sayesinde günlük verimliliğim %40 arttı ve stres seviyem önemli ölçüde azaldı.`,
    category: 'yaşam',
    authorId: 'user5',
    authorName: 'Fatma Şahin',
    createdAt: new Date('2024-12-11T08:00:00'),
    likeCount: 89,
    commentCount: 34
  },
  {
    id: 'post6',
    title: 'JavaScript\'te Modern Async/Await Kullanımı',
    content: `JavaScript'te asenkron programlama artık çok daha kolay. Async/await syntax'ı ile Promise'ları nasıl daha temiz bir şekilde kullanabileceğimizi görelim.

Örnek kod:
\`\`\`javascript
async function fetchUserData() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
  }
}
\`\`\`

Bu yaklaşım callback hell'den kurtulmamızı sağlıyor ve kodumuzu çok daha okunabilir hale getiriyor.`,
    category: 'teknoloji',
    authorId: 'user1',
    authorName: 'Ayşe Yılmaz',
    createdAt: new Date('2024-12-10T16:30:00'),
    likeCount: 56,
    commentCount: 18
  },
  {
    id: 'post7',
    title: 'İstanbul\'un En İyi Kahve Mekanları',
    content: `İstanbul'da kahve kültürü çok eskilere dayanıyor. Bu yazımda şehrin farklı semtlerindeki en iyi kahve mekanlarını sizlerle paylaşacağım.

Kadıköy'den:
- Coffee Department
- Walter's Coffee Roastery
- Brew Lab

Beşiktaş'tan:
- Kronotrop
- Coffee Sapiens
- Brew Co.

Her birinin kendine özgü atmosferi ve özel kahve çeşitleri var. Kahve tutkunları için mutlaka görülmesi gereken yerler.`,
    category: 'yaşam',
    authorId: 'user3',
    authorName: 'Zeynep Demir',
    createdAt: new Date('2024-12-09T12:45:00'),
    likeCount: 73,
    commentCount: 28
  },
  {
    id: 'post8',
    title: 'Kişisel Gelişim İçin 5 Etkili Yöntem',
    content: `Kişisel gelişim sürekli bir yolculuk. Bu yazımda size kendi hayatımda uyguladığım ve sonuçlarını gördüğüm 5 etkili yöntemi paylaşacağım.

1. Günlük Okuma Alışkanlığı
2. Hedef Belirleme ve Takip
3. Yeni Beceriler Öğrenme
4. Networking ve İlişki Kurma
5. Kendini Değerlendirme

Bu yöntemleri düzenli olarak uyguladığınızda hayatınızda pozitif değişiklikler göreceksiniz.`,
    category: 'kişisel',
    authorId: 'user5',
    authorName: 'Fatma Şahin',
    createdAt: new Date('2024-12-08T10:20:00'),
    likeCount: 45,
    commentCount: 19
  },
  {
    id: 'post9',
    title: 'Minimalizm: Az ile Çok Yaşamak',
    content: `Minimalizm, hayatımızdaki fazlalıklardan kurtulup gerçekten önemli olanlara odaklanmamızı sağlar. Bu yazımda minimalizmin bana kattıklarını ve uygulama yollarını anlatıyorum.\n\n- Gereksiz eşyaları hayatımdan çıkardım\n- Dijital temizlik yaptım\n- Zamanımı daha verimli kullanmaya başladım\n\nAz ile çok yaşamak, zihinsel olarak da hafiflememi sağladı.`,
    category: 'yaşam',
    authorId: 'user1',
    authorName: 'Ayşe Yılmaz',
    createdAt: new Date('2024-12-07T13:00:00'),
    likeCount: 38,
    commentCount: 10
  },
  {
    id: 'post10',
    title: 'Python ile Veri Analizine Giriş',
    content: `Veri analizi günümüzün en önemli becerilerinden biri haline geldi. Python ile veri analizi yapmanın temellerini ve en çok kullanılan kütüphaneleri bu yazıda bulabilirsiniz.\n\n- Pandas ile veri işleme\n- Matplotlib ile görselleştirme\n- NumPy ile hızlı hesaplamalar\n\nKüçük projelerle başlayıp zamanla büyük veri setlerini analiz edebilirsiniz.`,
    category: 'teknoloji',
    authorId: 'user2',
    authorName: 'Mehmet Kaya',
    createdAt: new Date('2024-12-06T11:30:00'),
    likeCount: 29,
    commentCount: 7
  },
  {
    id: 'post11',
    title: 'Ege Kıyılarında Bir Hafta',
    content: `Ege'nin masmavi denizi ve huzurlu kasabalarında geçirdiğim bir haftayı anlatıyorum. Özellikle Ayvalık ve Datça favorilerim oldu.\n\n- Ayvalık'ta gün batımı\n- Datça'da doğa yürüyüşü\n- Alaçatı'da kahvaltı\n\nHer köşesi ayrı güzel, Ege'de keşfedilecek çok yer var!`,
    category: 'seyahat',
    authorId: 'user3',
    authorName: 'Zeynep Demir',
    createdAt: new Date('2024-12-05T17:45:00'),
    likeCount: 54,
    commentCount: 16
  },
  {
    id: 'post12',
    title: 'Online Eğitimde Başarı İçin İpuçları',
    content: `Online eğitimde motivasyonu korumak ve verimli çalışmak için bazı ipuçları:\n\n1. Çalışma alanını düzenle\n2. Hedefler belirle\n3. Kısa molalar ver\n4. Katılımcı ol\n5. Not al\n\nBu yöntemlerle online derslerden maksimum verim alabilirsin.`,
    category: 'eğitim',
    authorId: 'user4',
    authorName: 'Ali Öztürk',
    createdAt: new Date('2024-12-04T09:10:00'),
    likeCount: 22,
    commentCount: 5
  }
];

// Örnek beğeniler
export const sampleLikes = [
  { postId: 'post1', userId: 'user2', userName: 'Mehmet Kaya' },
  { postId: 'post1', userId: 'user3', userName: 'Zeynep Demir' },
  { postId: 'post1', userId: 'user4', userName: 'Ali Öztürk' },
  { postId: 'post2', userId: 'user1', userName: 'Ayşe Yılmaz' },
  { postId: 'post2', userId: 'user3', userName: 'Zeynep Demir' },
  { postId: 'post3', userId: 'user1', userName: 'Ayşe Yılmaz' },
  { postId: 'post3', userId: 'user2', userName: 'Mehmet Kaya' },
  { postId: 'post4', userId: 'user5', userName: 'Fatma Şahin' },
  { postId: 'post5', userId: 'user1', userName: 'Ayşe Yılmaz' },
  { postId: 'post5', userId: 'user2', userName: 'Mehmet Kaya' },
  { postId: 'post6', userId: 'user3', userName: 'Zeynep Demir' },
  { postId: 'post7', userId: 'user1', userName: 'Ayşe Yılmaz' },
  { postId: 'post8', userId: 'user2', userName: 'Mehmet Kaya' }
];

// Örnek yorumlar
export const sampleComments = [
  {
    postId: 'post1',
    userId: 'user2',
    userName: 'Mehmet Kaya',
    content: 'Harika bir yazı! React 19\'un yeni özelliklerini merakla bekliyorum.',
    createdAt: new Date('2024-12-15T11:00:00')
  },
  {
    postId: 'post1',
    userId: 'user3',
    userName: 'Zeynep Demir',
    content: 'use() hook\'u gerçekten çok kullanışlı görünüyor. Teşekkürler paylaşım için!',
    createdAt: new Date('2024-12-15T11:30:00')
  },
  {
    postId: 'post2',
    userId: 'user1',
    userName: 'Ayşe Yılmaz',
    content: 'Bu tarifi mutlaka deneyeceğim. Mantı yapımı çok seviyorum!',
    createdAt: new Date('2024-12-14T16:00:00')
  },
  {
    postId: 'post3',
    userId: 'user2',
    userName: 'Mehmet Kaya',
    content: 'Kapadokya gerçekten büyülü bir yer. Fotoğraflarınızı da görmek isterim.',
    createdAt: new Date('2024-12-13T10:00:00')
  },
  {
    postId: 'post5',
    userId: 'user1',
    userName: 'Ayşe Yılmaz',
    content: 'Bu rutini ben de denemek istiyorum. Sabah erken kalkmak gerçekten zor ama değiyor.',
    createdAt: new Date('2024-12-11T09:00:00')
  }
]; 