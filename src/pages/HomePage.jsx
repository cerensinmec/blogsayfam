import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  Divider,
  IconButton,
  Fade,
  Slide,
  Grow,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import AuthForm from '../components/AuthForm';
import TurkeyMap from '../components/TurkeyMap';
import cityCenters from '../constants/data/cityCenters.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlightIcon from '@mui/icons-material/Flight';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BlogPostCard from '../components/BlogPostCard';
import { themeColors } from '../theme/theme';

const HomePage = () => {
  const [user, authLoading] = useAuthState(auth);
  const navigate = useNavigate();
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [activeAuthors, setActiveAuthors] = useState([]);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [cityPosts, setCityPosts] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showAllFiltered, setShowAllFiltered] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  useEffect(() => {
    if (allPosts.length > 0) {
      detectCitiesInPosts();
    }
  }, [allPosts]);

  const fetchFeaturedContent = async () => {
    try {
      // Tüm blogları çek
      const blogsQuery = query(
        collection(db, 'blog-posts'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const blogsSnapshot = await getDocs(blogsQuery);
      const allBlogs = blogsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAllPosts(allBlogs);
      
      // Rastgele 3 blog seç
      const shuffledBlogs = allBlogs.sort(() => 0.5 - Math.random());
      setFeaturedBlogs(shuffledBlogs.slice(0, 3));

      // Aktif yazarları çek (rastgele 3 tane)
      const usersQuery = query(
        collection(db, 'users'),
        limit(20)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Rastgele 3 yazar seç
      const shuffledUsers = allUsers.sort(() => 0.5 - Math.random());
      setActiveAuthors(shuffledUsers.slice(0, 3));
      
    } catch (error) {
      console.error('İçerik yükleme hatası:', error);
    } finally {
      setContentLoading(false);
    }
  };

  // Blog yazılarında şehir tespit etme
  const detectCitiesInPosts = () => {
    const cityPostsData = {};
    allPosts.forEach(post => {
      const content = (post.title + ' ' + post.content).toLowerCase();
      
      // Tüm şehirleri kontrol et
      cityCenters.forEach(city => {
        if (content.includes(city.name.toLowerCase())) {
          if (!cityPostsData[city.name]) {
            cityPostsData[city.name] = [];
          }
          cityPostsData[city.name].push(post);
        }
      });
    });
    
    // Şehir verilerini güncelle
    setCityPosts(cityPostsData);
  };

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    // Giriş başarılı olduğunda kullanıcı durumunu güncelle
    // useAuthState hook'u otomatik olarak güncelleyecek
  };

  const handleCategoryClick = () => {
    if (!user && !authLoading) {
      setLoginAlertOpen(true);
    } else if (user) {
      navigate('/feed');
    }
  };

  const handleBlogClick = (blogId) => {
    if (!user && !authLoading) {
      setLoginAlertOpen(true);
    } else if (user) {
      navigate(`/blog/${blogId}`);
    }
  };

  const handleAuthorClick = (authorId) => {
    if (!user && !authLoading) {
      setLoginAlertOpen(true);
    } else if (user) {
      navigate(`/user/${authorId}`);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Teknoloji': themeColors.category,
      'Seyahat': themeColors.category,
      'Kişisel Gelişim': themeColors.category,
      'Girişimcilik': themeColors.category,
      'Genel': themeColors.category
    };
    return colors[category] || themeColors.category;
  };

  // Yazı türü filtreleme fonksiyonu
  const filterPostsByCategory = (category) => {
    if (!category) {
      setFilteredPosts([]);
      setSelectedCategory(null);
      setShowAllFiltered(false);
      return;
    }

    const filtered = allPosts.filter(post => {
      const content = (post.title + ' ' + post.content).toLowerCase();
      const wordCount = content.split(' ').length;
      
      switch (category) {
        case 'kisa':
          return wordCount <= 100;
        case 'orta':
          return wordCount > 100 && wordCount <= 500;
        case 'uzun':
          return wordCount > 500;
        case 'yeni':
          // Son 7 günde oluşturulan yazılar
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const postDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
          return postDate >= oneWeekAgo;
        case 'teknoloji':
          return content.includes('teknoloji') || content.includes('yazılım') || content.includes('programlama') || 
                 content.includes('bilgisayar') || content.includes('internet') || content.includes('uygulama');
        case 'seyahat':
          return content.includes('seyahat') || content.includes('gezi') || content.includes('turizm') || 
                 content.includes('tatil') || content.includes('yolculuk') || content.includes('keşif');
        case 'kisisel':
          return content.includes('kişisel') || content.includes('gelişim') || content.includes('motivasyon') || 
                 content.includes('hedef') || content.includes('başarı') || content.includes('deneyim');
        case 'is':
          return content.includes('iş') || content.includes('kariyer') || content.includes('girişim') || 
                 content.includes('şirket') || content.includes('çalışma') || content.includes('profesyonel');
        default:
          return true;
      }
    });

    setFilteredPosts(filtered);
    setSelectedCategory(category);
    setShowAllFiltered(false);
  };

  const categories = [
    { name: 'Teknoloji', icon: <TrendingUpIcon />, color: '#6366F1', description: 'En son teknoloji trendleri' },
    { name: 'Seyahat', icon: <FlightIcon />, color: '#10B981', description: 'Dünya keşifleri' },
    { name: 'Kişisel Gelişim', icon: <PsychologyIcon />, color: '#F59E0B', description: 'Kendini geliştir' },
    { name: 'Girişimcilik', icon: <BusinessIcon />, color: '#EF4444', description: 'İş dünyası' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'white',
      padding: 0,
      margin: 0
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        backgroundColor: 'white',
        color: '#5A0058',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sağ Üst Köşe Butonları */}
        <Box sx={{ 
          position: 'absolute', 
          top: 20, 
          right: 20, 
          zIndex: 10,
          display: 'flex',
          gap: 2
        }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setAuthDialogOpen(true)}
            sx={{
              bgcolor: '#8B5A8B',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              '&:hover': {
                bgcolor: '#7A4A7A',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Giriş Yap
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setAuthDialogOpen(true)}
            sx={{
              bgcolor: '#8B5A8B',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              '&:hover': {
                bgcolor: '#7A4A7A',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Kayıt Ol
          </Button>
        </Box>
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Grid container spacing={4} alignItems="center">
              {/* Sol taraf - Bloggi başlığı ve içerik (küçültülmüş) */}
              <Grid item xs={12} md={5}>
                <Fade in timeout={1000}>
                  <Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 900,
                        mb: 2,
                        lineHeight: 1.1,
                        color: '#000'
                      }}
                    >
                      Bloggi
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        lineHeight: 1.5,
                        color: '#000',
                        fontWeight: 500,
                        fontSize: { xs: '1rem', md: '1.1rem' }
                      }}
                    >
                      Belki bir anı, belki bir fikir, belki de sadece içinden geçenler…
                      <br />
                      <strong>Bloggi</strong>, kelimelerine yer açmak için burada.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                      <Chip 
                        label="#Yazılım" 
                        size="medium" 
                        sx={{ 
                          bgcolor: '#6366F1', 
                          color: 'white', 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }} 
                      />
                      <Chip 
                        label="#Motivasyon" 
                        size="medium" 
                        sx={{ 
                          bgcolor: '#F59E0B', 
                          color: 'white', 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }} 
                      />
                      <Chip 
                        label="#Freelance" 
                        size="medium" 
                        sx={{ 
                          bgcolor: '#10B981', 
                          color: 'white', 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }} 
                      />
                    </Box>


                  </Box>
                </Fade>
              </Grid>
              
              {/* Sağ taraf - Kategoriler (küçültülmüş) */}
              <Grid item xs={12} md={7}>
                <Slide direction="left" in timeout={1200}>
                  <Box sx={{ p: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3, 
                        fontWeight: 800, 
                        color: '#000',
                        textAlign: 'center'
                      }}
                    >
                      Kategoriler
                    </Typography>
                    
                    <Grid container spacing={1.5}>
                      {categories.map((category, index) => (
                        <Grid item xs={6} key={category.name}>
                          <Grow in timeout={1500 + index * 200}>
                            <Card 
                              elevation={3}
                              sx={{ 
                                p: 2, 
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: 'white',
                                border: `3px solid ${category.color}`,
                                textAlign: 'center',
                                '&:hover': { 
                                  transform: 'translateY(-6px)',
                                  boxShadow: `0 6px 20px ${category.color}40`,
                                  border: `3px solid ${category.color}`
                                }
                              }}
                              onClick={handleCategoryClick}
                            >
                              <Box sx={{ 
                                width: 45, 
                                height: 45, 
                                borderRadius: '50%', 
                                bgcolor: category.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 1.5,
                                color: 'white',
                                fontSize: '1.2rem',
                                boxShadow: `0 3px 12px ${category.color}50`
                              }}>
                                {category.icon}
                              </Box>
                              <Typography variant="subtitle1" fontWeight={700} sx={{ color: category.color, mb: 0.5 }}>
                                {category.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {category.description}
                              </Typography>
                            </Card>
                          </Grow>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Slide>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

        {/* Main Content */}
        <Container maxWidth={false} sx={{ py: 8, px: { xs: 2, md: 16, lg: 28 } }}>
          {/* Ana İçerik Grid - 3 Sütun */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* 1. Sütun - Günün Blogları */}
            <Grid item xs={12} lg={4}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 800, 
                  color: '#000',
                  textAlign: 'left',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 50,
                    height: 3,
                    bgcolor: themeColors.secondary,
                    borderRadius: 2
                  }
                }}
              >
                Günün Blogları
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {featuredBlogs.map((blog, index) => (
                  <Grow in timeout={1000 + index * 300} key={blog.id}>
                    <Card 
                      elevation={3} 
                      sx={{ 
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: 'white',
                        border: '3px solid white',
                        borderRadius: 2,
                        height: 200,
                        '&:hover': { 
                          transform: 'translateY(-4px) scale(1.01)',
                          boxShadow: '0 12px 30px rgba(90, 0, 88, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Chip 
                            label={blog.category || 'Genel'} 
                            size="small" 
                            sx={{ 
                              bgcolor: getCategoryColor(blog.category || 'Genel'), 
                              color: 'white', 
                              fontWeight: 700,
                              fontSize: '0.65rem'
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                            {Math.floor(Math.random() * 10) + 3} dk
                          </Typography>
                        </Box>
                        
                        <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: '#000', mb: 1.5, lineHeight: 1.3, flex: 1, fontSize: '0.95rem' }}>
                          {blog.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5, lineHeight: 1.5, fontSize: '0.8rem', flex: 1 }}>
                          {blog.content?.length > 100 
                            ? `${blog.content.substring(0, 100)}...` 
                            : blog.content
                          }
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                            {blog.authorName}
                          </Typography>
                          <Button 
                            variant="contained"
                            size="small"
                            onClick={() => handleBlogClick(blog.id)}
                            sx={{ 
                              bgcolor: themeColors.secondary,
                              fontWeight: 700,
                              borderRadius: 1.5,
                              px: 1.5,
                              py: 0.3,
                              fontSize: '0.7rem',
                              '&:hover': { 
                                bgcolor: themeColors.primary,
                                transform: 'translateY(-1px)'
                              }
                            }}
                          >
                            Oku
                            <ArrowForwardIcon sx={{ ml: 0.3, fontSize: '0.7rem' }} />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                ))}
              </Box>
            </Grid>

            {/* 2. Sütun - Orta Kısım (Anket ve Harita) */}
            <Grid item xs={12} lg={4} sx={{ minWidth: 0, flexShrink: 0 }}>
              {/* Anket */}
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 800, 
                  color: '#000',
                  textAlign: 'left',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 50,
                    height: 3,
                    bgcolor: themeColors.secondary,
                    borderRadius: 2
                  }
                }}
              >
                Yazı Seçimi
              </Typography>
              
              <Paper elevation={2} sx={{ p: 3.5, borderRadius: 2, bgcolor: 'white', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#000', fontSize: '1rem', textAlign: 'center' }}>
                  Bugün Ne Okumak İstersin?
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
                  <Button 
                    variant={selectedCategory === 'kisa' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => filterPostsByCategory(selectedCategory === 'kisa' ? null : 'kisa')}
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: 500, 
                      fontSize: '0.8rem', 
                      py: 0.7,
                      bgcolor: selectedCategory === 'kisa' ? themeColors.secondary : 'transparent',
                      borderColor: themeColors.secondary,
                      color: selectedCategory === 'kisa' ? 'white' : themeColors.secondary,
                      '&:hover': {
                        bgcolor: selectedCategory === 'kisa' ? themeColors.primary : 'rgba(139, 90, 139, 0.05)'
                      }
                    }}
                  >
                    Kısa Yazılar
                  </Button>
                  <Button 
                    variant={selectedCategory === 'uzun' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => filterPostsByCategory(selectedCategory === 'uzun' ? null : 'uzun')}
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: 500, 
                      fontSize: '0.8rem', 
                      py: 0.7,
                      bgcolor: selectedCategory === 'uzun' ? themeColors.secondary : 'transparent',
                      borderColor: themeColors.secondary,
                      color: selectedCategory === 'uzun' ? 'white' : themeColors.secondary,
                      '&:hover': {
                        bgcolor: selectedCategory === 'uzun' ? themeColors.primary : 'rgba(139, 90, 139, 0.05)'
                      }
                    }}
                  >
                    Uzun Yazılar
                  </Button>
                  <Button 
                    variant={selectedCategory === 'yeni' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => filterPostsByCategory(selectedCategory === 'yeni' ? null : 'yeni')}
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: 500, 
                      fontSize: '0.8rem', 
                      py: 0.7,
                      bgcolor: selectedCategory === 'yeni' ? themeColors.secondary : 'transparent',
                      borderColor: themeColors.secondary,
                      color: selectedCategory === 'yeni' ? 'white' : themeColors.secondary,
                      '&:hover': {
                        bgcolor: selectedCategory === 'yeni' ? themeColors.primary : 'rgba(139, 90, 139, 0.05)'
                      }
                    }}
                  >
                    En Yeni Yazılar
                  </Button>
                </Box>
                
                {selectedCategory && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#6D4C41', fontSize: '0.85rem' }}>
                      {selectedCategory === 'kisa' && `Kısa yazılar (${filteredPosts.length})`}
                      {selectedCategory === 'uzun' && `Uzun yazılar (${filteredPosts.length})`}
                      {selectedCategory === 'yeni' && `En yeni yazılar (${filteredPosts.length})`}
                    </Typography>
                    {filteredPosts.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Uygun yazı bulunamadı.</Typography>
                    ) : (
                      <Box>
                        <List dense>
                          {(showAllFiltered ? filteredPosts : filteredPosts.slice(0, 2)).map(post => (
                            <ListItem key={post.id} disablePadding>
                              <ListItemButton onClick={() => handleBlogClick(post.id)} sx={{ py: 0.5 }}>
                                <ListItemText primary={post.title} sx={{ fontSize: '0.8rem' }} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                        {filteredPosts.length > 2 && (
                          <Button 
                            variant="text" 
                            size="small"
                            onClick={() => setShowAllFiltered(!showAllFiltered)}
                            sx={{ 
                              mt: 1, 
                              color: '#8B5A8B',
                              textTransform: 'none',
                              fontSize: '0.75rem'
                            }}
                          >
                            {showAllFiltered ? 'Daha az göster' : `${filteredPosts.length - 2} yazı daha göster`}
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>

              {/* Harita */}
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 800, 
                  color: '#2c3e50',
                  textAlign: 'left',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 50,
                    height: 3,
                    bgcolor: themeColors.accent,
                    borderRadius: 2
                  }
                }}
              >
                Yazıların Haritası
              </Typography>
              
              <Paper elevation={2} sx={{ p: 3.5, borderRadius: 2, bgcolor: 'white', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 0, flexShrink: 0 }}>
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: 200, 
                  bgcolor: '#fff',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  minWidth: 0, // Flexbox shrink sorununu çözer
                  flexShrink: 0, // Genişliğin küçülmesini engeller
                  maxWidth: '100%' // Maksimum genişliği sınırla
                }}>
                  <TurkeyMap 
                    onCitySelect={(cityObj) => {
                      const cityName = cityObj.name || cityObj.id || cityObj;
                      setSelectedCity(selectedCity === cityName ? null : cityName);
                    }}
                    cityHasPostsMap={Object.fromEntries(Object.entries(cityPosts).map(([city, posts]) => [city, posts.length > 0]))}
                    style={{ width: '100%', height: '100%' }}
                  />
                  
                  {/* Seçilen şehir yazıları overlay */}
                  {selectedCity && (
                    <Box sx={{ 
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 10,
                      bgcolor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: 1,
                      border: '1px solid #e9ecef',
                      p: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 10,
                      overflow: 'auto',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ color: '#6D4C41', fontSize: '0.85rem', fontWeight: 600 }}>
                          {selectedCity} ({cityPosts[selectedCity]?.length || 0} yazı)
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => setSelectedCity(null)}
                          sx={{ 
                            minWidth: 'auto', 
                            p: 0.5, 
                            color: '#666',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
                          }}
                        >
                          ✕
                        </Button>
                      </Box>
                      
                      {cityPosts[selectedCity]?.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textAlign: 'center', mt: 2 }}>
                          Bu şehirle ilgili yazı bulunamadı.
                        </Typography>
                      ) : (
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                          {cityPosts[selectedCity]?.map(post => (
                            <Box 
                              key={post.id} 
                              sx={{ 
                                p: 1, 
                                mb: 1, 
                                bgcolor: 'white', 
                                borderRadius: 0.5,
                                cursor: 'pointer',
                                border: '1px solid #e0e0e0',
                                transition: 'all 0.3s ease',
                                                              '&:hover': { 
                                bgcolor: themeColors.accent, 
                                color: 'white',
                                transform: 'translateX(2px)',
                                boxShadow: '0 2px 6px rgba(102, 126, 234, 0.3)'
                              }
                              }}
                              onClick={() => handleBlogClick(post.id)}
                            >
                              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem', mb: 0.5, lineHeight: 1.2 }}>
                                {post.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                {post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleString('tr-TR') : ''}
                                {post.likeCount > 0 && ` • ❤️ ${post.likeCount}`}
                                {post.commentCount > 0 && ` • 💬 ${post.commentCount}`}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontSize: '0.75rem' }}>
                  🔴 Noktalar: Blog yazısı olan şehirler
                </Typography>
              </Paper>
            </Grid>



            {/* 3. Sütun - Aktif Yazarlar */}
            <Grid item xs={12} lg={4}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 800, 
                  color: '#000',
                  textAlign: 'left',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 50,
                    height: 3,
                    bgcolor: themeColors.secondary,
                    borderRadius: 2
                  }
                }}
              >
                Aktif Yazarlar
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activeAuthors.map((author, index) => (
                  <Grow in timeout={1200 + index * 200} key={author.id}>
                    <Card 
                      elevation={3}
                      sx={{ 
                        transition: 'background 0.2s',
                        background: 'white',
                        border: '3px solid white',
                        borderRadius: 2,
                        cursor: 'pointer',
                        height: 200,
                        '&:hover': { 
                          background: 'rgba(90, 0, 88, 0.02)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(90, 0, 88, 0.15)'
                        }
                      }}
                      onClick={() => handleAuthorClick(author.id)}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3.5, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Avatar 
                            src={author.photoURL || ''} 
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              mb: 1.5,
                              bgcolor: themeColors.secondary,
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              border: `2px solid ${themeColors.secondary}`
                            }}
                          >
                            {author.displayName ? author.displayName.charAt(0).toUpperCase() : 'U'}
                          </Avatar>
                          
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#000', fontSize: '0.9rem' }}>
                            {author.displayName || author.username || ((author.firstName || '') + ' ' + (author.lastName || '')).trim() || author.email || 'Kullanıcı'}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1.5, fontSize: '0.75rem', lineHeight: 1.3 }}>
                            {author.bio || 'Henüz biyografi eklenmemiş.'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Chip 
                            label="Blog Yazarı" 
                            size="small" 
                            sx={{ 
                              bgcolor: '#8B5A8B', 
                              color: 'white', 
                              fontWeight: 600,
                              fontSize: '0.65rem'
                            }}
                          />
                          <Chip 
                            label="Aktif" 
                            size="small" 
                            sx={{ 
                              bgcolor: '#10B981', 
                              color: 'white', 
                              fontWeight: 600,
                              fontSize: '0.65rem'
                            }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </Grow>
                ))}
              </Box>
            </Grid>
          </Grid>




      </Container>
      
      <AuthForm 
        open={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
      
      {/* Giriş Yapma Uyarısı */}
      <Snackbar
        open={loginAlertOpen}
        autoHideDuration={4000}
        onClose={() => setLoginAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setLoginAlertOpen(false)} 
          severity="warning" 
          sx={{ 
            width: '100%',
            bgcolor: '#FFF3CD',
            color: '#856404',
            border: '1px solid #FFEAA7',
            '& .MuiAlert-icon': {
              color: '#856404'
            }
          }}
        >
          Lütfen önce giriş yapınız!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
