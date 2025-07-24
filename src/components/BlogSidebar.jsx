import React from 'react';
import { Box, Paper, Typography, Stack, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import TurkeyMap from './TurkeyMap';
import cityCenters from '../constants/data/cityCenters.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const defaultCategories = [
  { name: 'Yaşam', icon: '🌱', color: 'success', path: '/blog?category=yaşam' },
  { name: 'Teknoloji', icon: '💻', color: 'primary', path: '/blog?category=teknoloji' },
  { name: 'Seyahat', icon: '✈️', color: 'info', path: '/blog?category=seyahat' },
  { name: 'Yemek', icon: '🍕', color: 'warning', path: '/blog?category=yemek' },
  { name: 'Eğitim', icon: '📚', color: 'secondary', path: '/blog?category=eğitim' },
  { name: 'Kişisel', icon: '💭', color: 'default', path: '/blog?category=kişisel' }
];
const defaultStats = { posts: 0, users: 0, views: 0 };

function BlogSidebar({ posts, navigate, categories = defaultCategories, stats = defaultStats, loading = false, showHomeSidebar = false, titleColor }) {
  const [selectedType, setSelectedType] = React.useState(null);
  const [selectedCity, setSelectedCity] = React.useState(null);
  const [allPosts, setAllPosts] = React.useState([]);
  // Tüm blog yazılarını Firebase'den çek
  React.useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const postsRef = collection(db, 'blog-posts');
        const postsSnapshot = await getDocs(postsRef);
        const postsData = postsSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
        setAllPosts(postsData);
      } catch (error) {
        console.error('Tüm postlar yüklenirken hata:', error);
        // Hata durumunda mevcut posts'u kullan
        setAllPosts(posts);
      }
    };
    fetchAllPosts();
  }, [posts]);

  // Tüm Türkiye şehirlerini cityCenters'dan al
  const allTurkishCities = cityCenters.reduce((acc, city) => {
    acc[city.name] = city;
    acc[city.dataCityName] = city;
    return acc;
  }, {});

  // Blog yazılarında şehir tespit etme (tüm postları kullan)
  const detectCitiesInPosts = () => {
    const cityPosts = {};
    allPosts.forEach(post => {
      const content = (post.title + ' ' + post.content).toLowerCase();
      
      // Tüm şehirleri kontrol et
      cityCenters.forEach(city => {
        const cityName = city.name.toLowerCase();
        const dataCityName = city.dataCityName.toLowerCase();
        
        // Tam kelime eşleştirmesi için regex kullan
        const cityNameRegex = new RegExp(`\\b${cityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const dataCityNameRegex = new RegExp(`\\b${dataCityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        
        if (cityNameRegex.test(content) || dataCityNameRegex.test(content)) {
          // Hem normal isim hem de data isim için kaydet
          if (!cityPosts[city.name]) {
            cityPosts[city.name] = [];
          }
          if (!cityPosts[city.dataCityName]) {
            cityPosts[city.dataCityName] = [];
          }
          cityPosts[city.name].push(post);
          cityPosts[city.dataCityName].push(post);
        }
      });
    });
    return cityPosts;
  };

  const cityPosts = detectCitiesInPosts();
  // Kısa yazı: 500 karakterden az, Uzun yazı: 1000 karakterden fazla
  const shortPosts = (posts || []).filter(p => p.content && p.content.length < 500);
  const longPosts = (posts || []).filter(p => p.content && p.content.length > 1000);
  const newestPosts = [...(posts || [])].sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).slice(0, 5);

  let resultList = [];
  if (selectedType === 'short') resultList = shortPosts;
  if (selectedType === 'long') resultList = longPosts;
  if (selectedType === 'newest') resultList = newestPosts;
  if (selectedCity) resultList = cityPosts[selectedCity] || [];

  const handleCityClick = (city) => {
    setSelectedCity(selectedCity === city ? null : city);
    setSelectedType(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, bgcolor: 'transparent', height: '100vh', minWidth: 0, p: 2 }}>
      {/* Kategoriler ve İstatistikler */}
      {/* HomeSidebar kaldırıldı */}
      {/* Anket Kutusu */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', mb: 2, width: '100%', maxWidth: 340, mx: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: titleColor || '#8D6E63', fontSize: '1.1rem' }}>
          Blog Yazıları
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#8D6E63', fontSize: '1.1rem' }}>
          Bugün Ne Okumak İstersin?
        </Typography>
        <Stack direction="column" spacing={1.2} sx={{ mb: 2 }}>
          <Button 
            variant={selectedType === 'short' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => { setSelectedType('short'); setSelectedCity(null); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500, fontSize: '0.95rem', py: 0.7 }}
          >
            Kısa Yazılar
          </Button>
          <Button 
            variant={selectedType === 'long' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => { setSelectedType('long'); setSelectedCity(null); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500, fontSize: '0.95rem', py: 0.7 }}
          >
            Uzun Yazılar
          </Button>
          <Button 
            variant={selectedType === 'newest' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => { setSelectedType('newest'); setSelectedCity(null); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500, fontSize: '0.95rem', py: 0.7 }}
          >
            En Yeni Yazılar
          </Button>
        </Stack>
        {selectedType && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#6D4C41', fontSize: '0.95rem' }}>
              {selectedType === 'short' && `Kısa yazılar (${shortPosts.length})`}
              {selectedType === 'long' && `Uzun yazılar (${longPosts.length})`}
              {selectedType === 'newest' && `En yeni yazılar`}
            </Typography>
            {resultList.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Uygun yazı bulunamadı.</Typography>
            ) : (
              <List dense>
                {resultList.map(post => (
                  <ListItem key={post.firestoreId} disablePadding>
                    <ListItemButton onClick={() => navigate(`/blog/${post.firestoreId}`)}>
                      <ListItemText primary={post.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Paper>
      {/* Harita Kutusu */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', width: '100%', maxWidth: 340, mx: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#8D6E63', fontSize: '1.1rem' }}>
          Yazıların Haritası
        </Typography>
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 150, 
          bgcolor: '#fff',
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1
        }}>
          <TurkeyMap 
            onCitySelect={(cityObj) => {
              setSelectedCity(cityObj.name || cityObj.id || cityObj);
              setSelectedType(null);
            }}
            cityHasPostsMap={Object.fromEntries(Object.entries(cityPosts).map(([city, posts]) => [city, posts.length > 0]))}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          🔴 Noktalar: Blog yazısı olan şehirler
        </Typography>
        {selectedCity && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#6D4C41', fontSize: '0.95rem' }}>
              {selectedCity} ile ilgili yazılar ({cityPosts[selectedCity]?.length || 0})
            </Typography>
            {resultList.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Bu şehirle ilgili yazı bulunamadı.</Typography>
            ) : (
              <List dense>
                {resultList.map(post => (
                  <ListItem key={post.firestoreId} disablePadding>
                    <ListItemButton onClick={() => navigate(`/blog/${post.firestoreId}`)}>
                      <ListItemText primary={post.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default BlogSidebar; 