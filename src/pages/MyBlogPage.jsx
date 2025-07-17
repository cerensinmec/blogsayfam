import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  useNavigate 
} from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

function MyBlogPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const categories = [
    { title: 'Kişisel Bilgiler', route: '/kisisel-bilgiler', emoji: '👤' },
    { title: 'Eğitim', route: '/egitim', emoji: '🎓' },
    { title: 'Memleket', route: '/memleket', emoji: '🏠' },
    { title: 'Seyahatlerim', route: '/seyahatlerim', emoji: '✈️' },
    { title: 'Hobilerim', route: '/hobilerim', emoji: '🎨' },
    { title: 'Dizi/Film', route: '/dizi-film', emoji: '🎬' }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUserPosts(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(db, 'blog-posts'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(postsQuery);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
    } catch (error) {
      console.error('Kullanıcı blog yazıları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
        Blog Sayfam 📝
      </Typography>

      {/* Hoşgeldin Mesajı */}
      <Box sx={{ background: 'transparent', color: 'primary.main', p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Selam ben Ceren👋🏼
        </Typography>
        <Typography variant="body1">
          Blog sayfama hoşgeldin. Umarım blog sayfamı incelemekten keyif alırsın.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{
            '.MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
            '.MuiTab-root': {
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '1.1rem',
              '&:hover': {
                color: 'primary.dark',
                backgroundColor: 'secondary.light',
              },
              '&.Mui-selected': {
                color: 'primary.dark',
                backgroundColor: 'secondary.main',
              },
              '&.Mui-focusVisible': {
                color: 'primary.dark',
                backgroundColor: 'secondary.main',
              }
            }
          }}
        >
          <Tab label="Blog Kategorileri" />
          <Tab label="Blog Yazılarım" />
          <Tab label="İstatistiklerim" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Blog Kategorileri
          </Typography>
          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(category.route)}
                  sx={{
                    width: '100%',
                    height: 180,
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    boxShadow: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '&:active': { bgcolor: 'primary.dark' },
                    '&:focus': { bgcolor: 'primary.dark' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>{category.emoji}</span>
                  {category.title}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {user ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Blog Yazılarım ({userPosts.length})
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/blog')}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '&:active': { bgcolor: 'primary.dark' },
                    '&:focus': { bgcolor: 'primary.dark' }
                  }}
                >
                  Yeni Yazı Ekle
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : userPosts.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Henüz blog yazınız yok
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      İlk blog yazınızı oluşturmak için aşağıdaki butona tıklayın.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/blog')}
                    >
                      İlk Yazımı Oluştur
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {userPosts.map((post) => (
                    <Grid item xs={12} md={6} key={post.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {post.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {post.content.length > 150
                              ? `${post.content.substring(0, 150)}...`
                              : post.content}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(post.createdAt)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                onClick={() => navigate(`/blog/${post.id}`)}
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'primary.contrastText',
                                  '&:hover': { bgcolor: 'primary.dark' },
                                  '&:active': { bgcolor: 'primary.dark' },
                                  '&:focus': { bgcolor: 'primary.dark' }
                                }}
                              >
                                Görüntüle
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/blog/edit/${post.id}`)}
                                sx={{
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  '&:hover': { bgcolor: 'primary.dark', color: 'primary.contrastText', borderColor: 'primary.dark' },
                                  '&:active': { bgcolor: 'primary.dark', color: 'primary.contrastText', borderColor: 'primary.dark' },
                                  '&:focus': { bgcolor: 'primary.dark', color: 'primary.contrastText', borderColor: 'primary.dark' }
                                }}
                              >
                                Düzenle
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              Blog yazılarınızı görmek için giriş yapmalısınız.
            </Alert>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Blog İstatistiklerim
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {userPosts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Yazı
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary" gutterBottom>
                    {userPosts.filter(post => post.category === 'teknoloji').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Teknoloji Yazıları
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {userPosts.filter(post => post.category === 'yaşam').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yaşam Yazıları
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {userPosts.filter(post => post.category === 'eğitim').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eğitim Yazıları
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default MyBlogPage; 