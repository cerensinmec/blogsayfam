import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Fab,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import BlogPostDialog from '../components/BlogPostDialog';
import BlogPostCard from '../components/BlogPostCard';
import TurkeyMap from '../components/TurkeyMap';

function BlogSidebar({ posts, navigate }) {
  const [selectedType, setSelectedType] = React.useState(null);
  const [selectedCity, setSelectedCity] = React.useState(null);

  // Türkiye şehirleri ve harita için gerçekçi koordinatlar (viewBox: 0 0 800 600)
  const turkishCities = {
    'İstanbul': { x: 170, y: 110 },
    'Ankara': { x: 410, y: 220 },
    'İzmir': { x: 120, y: 300 },
    'Bursa': { x: 200, y: 170 },
    'Adana': { x: 570, y: 370 },
    'Antalya': { x: 320, y: 420 },
    'Konya': { x: 420, y: 340 },
    'Gaziantep': { x: 670, y: 390 },
    'Kayseri': { x: 520, y: 260 },
    'Mersin': { x: 500, y: 400 },
    'Diyarbakır': { x: 700, y: 300 },
    'Samsun': { x: 540, y: 120 },
    'Eskişehir': { x: 320, y: 200 },
    'Denizli': { x: 200, y: 350 },
    'Trabzon': { x: 720, y: 100 }
  };

  // Blog yazılarında şehir tespit etme
  const detectCitiesInPosts = () => {
    const cityPosts = {};
    
    posts.forEach(post => {
      const content = (post.title + ' ' + post.content).toLowerCase();
      
      Object.keys(turkishCities).forEach(city => {
        if (content.includes(city.toLowerCase())) {
          if (!cityPosts[city]) {
            cityPosts[city] = [];
          }
          cityPosts[city].push(post);
        }
      });
    });
    
    return cityPosts;
  };

  const cityPosts = detectCitiesInPosts();

  // Kısa yazı: 500 karakterden az, Uzun yazı: 1000 karakterden fazla
  const shortPosts = posts.filter(p => p.content.length < 500);
  const longPosts = posts.filter(p => p.content.length > 1000);
  const newestPosts = [...posts].sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).slice(0, 5);

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Anket Kutusu */}
      <Box component={Paper} elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#8D6E63' }}>
          Bugün Ne Okumak İstersin?
        </Typography>
        <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
          <Button 
            variant={selectedType === 'short' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => { setSelectedType('short'); setSelectedCity(null); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Kısa Yazılar
          </Button>
          <Button 
            variant={selectedType === 'long' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => { setSelectedType('long'); setSelectedCity(null); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Uzun Yazılar
          </Button>
          <Button 
            variant={selectedType === 'newest' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => { setSelectedType('newest'); setSelectedCity(null); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            En Yeni Yazılar
          </Button>
        </Stack>

        {selectedType && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#6D4C41' }}>
              {selectedType === 'short' && `Kısa yazılar (${shortPosts.length})`}
              {selectedType === 'long' && `Uzun yazılar (${longPosts.length})`}
              {selectedType === 'newest' && `En yeni yazılar`}
            </Typography>
            {resultList.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Uygun yazı bulunamadı.</Typography>
            ) : (
              <List dense>
                {resultList.map(post => (
                  <ListItem key={post.id} disablePadding>
                    <ListItemButton onClick={() => navigate(`/blog/${post.id}`)}>
                      <ListItemText primary={post.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>

      {/* Harita Kutusu */}
      <Box component={Paper} elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#8D6E63' }}>
          Yazıların Haritası
        </Typography>
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 180, 
          bgcolor: '#f5f5f5', 
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Türkiye SVG haritası */}
          {/* <img src="/turkey-map.svg" alt="Türkiye Haritası" style={{ width: '100%', height: '100%', display: 'block' }} /> */}
          <TurkeyMap style={{ width: '100%', height: '100%' }} />
          {/* Şehir noktaları */}
          {Object.entries(turkishCities).map(([city, coords]) => {
            const hasPosts = cityPosts[city] && cityPosts[city].length > 0;
            const postCount = hasPosts ? cityPosts[city].length : 0;
            // Koordinatları harita kutusunun boyutuna göre normalize et (800x600 -> 100%x180px)
            const left = `calc(${(coords.x / 800) * 100}% - 10px)`;
            const top = `calc(${(coords.y / 600) * 180}px - 10px)`;
            return (
              <Box
                key={city}
                sx={{
                  position: 'absolute',
                  left,
                  top,
                  width: hasPosts ? 20 : 14,
                  height: hasPosts ? 20 : 14,
                  bgcolor: hasPosts ? '#ff5722' : '#ccc',
                  border: '2px solid #fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  boxShadow: hasPosts ? '0 0 6px 2px #ff5722aa' : 'none',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.2)' }
                }}
                onClick={() => handleCityClick(city)}
                title={city + (hasPosts ? ` (${postCount} yazı)` : '')}
              >
                {hasPosts && (
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>
                    {postCount}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          🔴 Noktalar: Blog yazısı olan şehirler
        </Typography>

        {selectedCity && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#6D4C41' }}>
              {selectedCity} ile ilgili yazılar ({cityPosts[selectedCity]?.length || 0})
            </Typography>
            {resultList.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Bu şehirle ilgili yazı bulunamadı.</Typography>
            ) : (
              <List dense>
                {resultList.map(post => (
                  <ListItem key={post.id} disablePadding>
                    <ListItemButton onClick={() => navigate(`/blog/${post.id}`)}>
                      <ListItemText primary={post.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'genel'
  });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, 'blog-posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = [];
      querySnapshot.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        postsData.push(postData);
      });
      setPosts(postsData);
      setFilteredPosts(postsData);
    } catch (error) {
      setError('Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', category: 'genel' });
    setDialogOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category || 'genel'
    });
    setDialogOpen(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'blog-posts', postId));
        await fetchPosts();
      } catch (error) {
        setError('Blog yazısı silinirken bir hata oluştu.');
      }
    }
  };

  const handleDialogSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Başlık ve içerik alanları zorunludur.');
      return;
    }
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorPhotoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      if (editingPost) {
        await updateDoc(doc(db, 'blog-posts', editingPost.id), {
          ...postData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'blog-posts'), postData);
      }
      setDialogOpen(false);
      setFormData({ title: '', content: '', category: 'genel' });
      setEditingPost(null);
      setError('');
      await fetchPosts();
    } catch (error) {
      setError('Blog yazısı kaydedilirken bir hata oluştu.');
    }
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      genel: 'primary',
      teknoloji: 'secondary',
      yaşam: 'success',
      eğitim: 'warning',
      seyahat: 'info',
      yemek: 'error',
      kişisel: 'default',
      diğer: 'default'
    };
    return colors[category] || 'default';
  };

  // Şehir adına göre blog yazılarını filtrele
  const cityPosts = selectedCity
    ? posts.filter(post => {
        const content = (post.title + ' ' + post.content).toLowerCase();
        return (
          content.includes(selectedCity.name?.toLowerCase?.()) ||
          content.includes(selectedCity.dataCityName?.toLowerCase?.())
        );
      })
    : [];

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      width: '100%',
      minHeight: '100vh',
    }}>
      {/* Ana içerik */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        pr: { xs: 1, sm: 2, md: 4 }, 
        pl: { xs: 1, sm: 2, md: 4 }, 
        pt: { xs: 2, md: 4 } 
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#2c3e50',
              mb: 1
            }}
          >
            Blog Yazıları
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Düşüncelerimi, deneyimlerimi ve öğrendiklerimi paylaştığım blog yazılarım
          </Typography>
        </Box>
        {/* Search and Filter Section */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={12}>
              <Box sx={{ mb: 0, p: { xs: 2, md: 3 }, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      placeholder="Blog yazılarında ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />, sx: { borderRadius: 2 }
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#8D6E63' } } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Kategori</InputLabel>
                      <Select
                        value={selectedCategory}
                        label="Kategori"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="all">Tüm Kategoriler</MenuItem>
                        <MenuItem value="genel">Genel</MenuItem>
                        <MenuItem value="teknoloji">Teknoloji</MenuItem>
                        <MenuItem value="yaşam">Yaşam</MenuItem>
                        <MenuItem value="eğitim">Eğitim</MenuItem>
                        <MenuItem value="seyahat">Seyahat</MenuItem>
                        <MenuItem value="yemek">Yemek</MenuItem>
                        <MenuItem value="kişisel">Kişisel</MenuItem>
                        <MenuItem value="diğer">Diğer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Add Post Button */}
        {user && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPost}
              size="large"
              sx={{
                bgcolor: '#8D6E63',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#6D4C41',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(141, 110, 99, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Yeni Blog Yazısı
            </Button>
          </Box>
        )}
        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {posts.length === 0 ? 'Henüz blog yazısı bulunmuyor.' : 'Arama kriterlerinize uygun blog yazısı bulunamadı.'}
            </Typography>
            {user && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddPost}
                sx={{ mt: 2, borderColor: '#8D6E63', color: '#8D6E63', '&:hover': { borderColor: '#6D4C41', bgcolor: 'rgba(141, 110, 99, 0.08)' } }}
              >
                İlk Yazıyı Ekle
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {filteredPosts.map((post) => (
                <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
                  <BlogPostCard
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    formatDate={formatDate}
                    getCategoryColor={getCategoryColor}
                    user={user}
                    navigate={navigate}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <BlogPostDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleDialogSubmit}
          formData={formData}
          setFormData={setFormData}
          editingPost={editingPost}
          error={error}
        />
        {/* Floating Action Button */}
        {user && (
          <Fab
            color="primary"
            aria-label="yeni blog yazısı"
            onClick={handleAddPost}
            sx={{ position: 'fixed', bottom: 80, right: 24, zIndex: 1400, bgcolor: '#8D6E63', '&:hover': { bgcolor: '#6D4C41', transform: 'scale(1.1)' }, transition: 'all 0.3s ease' }}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
      {/* Sidebar */}
      <Box sx={{
        width: { xs: '100%', md: 340 },
        minWidth: { md: 280 },
        maxWidth: { md: 380 },
        background: '#f3d6ce',
        p: { xs: 1, md: 2 },
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        height: { md: '100vh' },
        mb: { xs: 4, md: 0 },
        borderRadius: 0,
        justifyContent: 'flex-start',
      }}>
        <BlogSidebar posts={posts} navigate={navigate} />
      </Box>
    </Box>
  );
}

export default BlogPage; 