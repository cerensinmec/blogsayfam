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
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  useNavigate 
} from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Delete as DeleteIcon } from '@mui/icons-material';

function MyBlogPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = [];

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

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'blog-posts', postToDelete.id));
      
      // Listeyi güncelle
      setUserPosts(userPosts.filter(post => post.id !== postToDelete.id));
      
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Blog yazısı silinirken hata:', error);
      alert('Blog yazısı silinirken bir hata oluştu.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
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
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleDeleteClick(post)}
                                sx={{
                                  color: 'error.main',
                                  borderColor: 'error.main',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': { 
                                    bgcolor: 'error.main', 
                                    color: 'white',
                                    borderColor: 'error.main'
                                  }
                                }}
                                title="Blog yazısını sil"
                              >
                                🗑️
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

      {/* Silme Onay Dialogu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          🗑️ Blog Yazısını Sil
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>"{postToDelete?.title}"</strong> başlıklı blog yazısını silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bu işlem geri alınamaz. Blog yazısı ve tüm fotoğrafları kalıcı olarak silinecektir.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            disabled={deleting}
            sx={{ color: 'text.secondary' }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            disabled={deleting}
            variant="contained"
            color="error"
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleting ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyBlogPage; 