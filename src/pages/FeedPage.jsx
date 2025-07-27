import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Button,
  Grid,
  Chip,
  Alert,
  Paper
} from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import BlogPosts from '../components/BlogPosts';

const FeedPage = () => {
  const [user, authLoading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setPostsLoading(true);
      setError('');
      try {
        const postsRef = collection(db, 'blog-posts');
        const postsSnapshot = await getDocs(postsRef);
        const allPostsData = postsSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
        
        // Rastgele sıralama ve 15 tane seç
        const shuffledPosts = allPostsData.sort(() => Math.random() - 0.5);
        const randomPosts = shuffledPosts.slice(0, 15);
        setPosts(randomPosts);
        // Post id'lerini logla
        console.log('FeedPage - Post firestoreId ve id alanları:', randomPosts.map(p => ({ firestoreId: p.firestoreId, id: p.id })));
      } catch (e) {
        console.error('FeedPage - Veri yükleme hatası:', e);
        setError('Veriler yüklenirken hata oluştu.');
      } finally {
        setPostsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], posts: [] });
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Kullanıcı arama
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const filteredUsers = allUsers.filter(user => {
        const searchTerm = searchQuery.toLowerCase();
        const displayName = (user.displayName || '').toLowerCase();
        const username = (user.username || '').toLowerCase();
        const firstName = (user.firstName || '').toLowerCase();
        const lastName = (user.lastName || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        
        return displayName.includes(searchTerm) || 
               username.includes(searchTerm) || 
               firstName.includes(searchTerm) || 
               lastName.includes(searchTerm) || 
               email.includes(searchTerm);
      });

      // Blog yazıları arama
      const postsRef = collection(db, 'blog-posts');
      const postsSnapshot = await getDocs(postsRef);
      const allPosts = postsSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
      
      const filteredPosts = allPosts.filter(post => {
        const searchTerm = searchQuery.toLowerCase();
        const title = (post.title || '').toLowerCase();
        const content = (post.content || '').toLowerCase();
        const category = (post.category || '').toLowerCase();
        const authorName = (post.authorName || '').toLowerCase();
        
        return title.includes(searchTerm) || 
               content.includes(searchTerm) || 
               category.includes(searchTerm) || 
               authorName.includes(searchTerm);
      });
      
      setSearchResults({ users: filteredUsers, posts: filteredPosts });
      setShowSearchResults(true);
    } catch (error) {
      console.error('Arama hatası:', error);
      setSearchResults({ users: [], posts: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowSearchResults(false);
      setSearchResults({ users: [], posts: [] });
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Giriş yapmayan kullanıcılar için uyarı
  if (!authLoading && !user) {
    return (
      <Box sx={{
        backgroundColor: 'white',
        minHeight: '100vh',
        width: '100%',
        py: 4,
        px: { xs: 2, md: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Alert severity="warning" sx={{ mb: 3, fontSize: '1.1rem' }}>
              Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.
            </Alert>
            <Typography variant="h5" sx={{ mb: 2, color: '#5A0058', fontWeight: 700 }}>
              Akış Sayfasına Erişim
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Blog yazılarını görüntülemek, arama yapmak ve diğer kullanıcılarla etkileşimde bulunmak için lütfen hesabınıza giriş yapın.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#5A0058',
                '&:hover': { bgcolor: '#4A0047' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              Anasayfaya Dön
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundColor: 'white',
      minHeight: '100vh',
      width: '100%',
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* Arama Bölümü */}
        <Box sx={{ mb: 4, position: 'relative' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Kullanıcı, blog yazısı, yer ismi veya konu ara... (örn: Şirince, teknoloji, Ahmet)"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#87CEEB' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleSearch}
                      disabled={isSearching}
                      sx={{ color: '#87CEEB' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#87CEEB',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#87CEEB',
                    borderWidth: '2px',
                  },
                }
              }}
            />
          </Box>

          {/* Arama Sonuçları */}
          {showSearchResults && (
            <Box sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              zIndex: 1000,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #e0e0e0',
              mt: 1,
              maxHeight: 500,
              overflowY: 'auto'
            }}>
              {searchResults.users.length === 0 && searchResults.posts.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    {searchQuery.trim() ? 'Sonuç bulunamadı' : 'Arama yapmak için bir şeyler yazın'}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  {/* Kullanıcı Sonuçları */}
                  {searchResults.users.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: '#87CEEB', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16 }} />
                        {searchResults.users.length} kullanıcı bulundu
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {searchResults.users.map((user) => (
                          <Box 
                            key={user.id}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              p: 2, 
                              cursor: 'pointer',
                              borderRadius: 1,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: '#f5f5f5',
                                transform: 'translateX(4px)'
                              }
                            }}
                            onClick={() => handleUserClick(user.id)}
                          >
                            <Avatar 
                              src={user.photoURL || ''} 
                              sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: '#87CEEB'
                              }}
                            >
                              {user.displayName?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Bilinmeyen Kullanıcı'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                @{user.username || 'kullanici'}
                              </Typography>
                            </Box>
                            <Button 
                              variant="outlined" 
                              size="small"
                              startIcon={<PersonIcon />}
                              sx={{ 
                                borderColor: '#87CEEB',
                                color: '#87CEEB',
                                '&:hover': {
                                  borderColor: '#7BB8D9',
                                  color: '#7BB8D9'
                                }
                              }}
                            >
                              Profili Gör
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Blog Yazısı Sonuçları */}
                  {searchResults.posts.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: '#87CEEB', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        📝 {searchResults.posts.length} blog yazısı bulundu
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {searchResults.posts.map((post) => (
                          <Box 
                            key={post.firestoreId}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              p: 2, 
                              cursor: 'pointer',
                              borderRadius: 1,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: '#f5f5f5',
                                transform: 'translateX(4px)'
                              }
                            }}
                            onClick={() => handlePostClick(post.firestoreId)}
                          >
                            <Box sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: '#87CEEB', 
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 600
                            }}>
                              📝
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                                {post.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {post.content?.length > 80 ? `${post.content.substring(0, 80)}...` : post.content}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip 
                                  label={post.category || 'Genel'} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#87CEEB', 
                                    color: '#2c3e50', 
                                    fontWeight: 600,
                                    fontSize: '0.6rem',
                                    height: 20
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {post.authorName || 'Bilinmeyen Yazar'}
                                </Typography>
                              </Box>
                            </Box>
                            <Button 
                              variant="contained"
                              size="small"
                              sx={{ 
                                bgcolor: '#87CEEB',
                                fontWeight: 600,
                                borderRadius: 1.5,
                                px: 1.5,
                                py: 0.3,
                                fontSize: '0.7rem',
                                '&:hover': { 
                                  bgcolor: '#7BB8D9'
                                }
                              }}
                            >
                              Oku
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Blog Yazıları */}
        <BlogPosts posts={posts} loading={postsLoading} error={error} navigate={navigate} formatDate={formatDate} titleColor="#2c3e50" />
      </Container>
    </Box>
  );
};

export default FeedPage; 