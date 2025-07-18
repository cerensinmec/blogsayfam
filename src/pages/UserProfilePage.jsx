import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

function UserProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('UserProfilePage - userId:', userId);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchProfileAndPosts();
    // eslint-disable-next-line
  }, [userId]);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('UserProfilePage - Profil ve yazılar yükleniyor, userId:', userId);
      
      // Profil
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      console.log('UserProfilePage - Kullanıcı dokümanı:', userSnap.exists() ? userSnap.data() : 'Bulunamadı');
      
      if (userSnap.exists()) {
        setProfile(userSnap.data());
      } else {
        setError('Kullanıcı profili bulunamadı.');
        setProfile(null);
      }
      
      // Blog yazıları - Index hatası olmaması için sadece authorId ile filtreleme
      const postsRef = collection(db, 'blog-posts');
      const q = query(postsRef, where('authorId', '==', userId));
      const querySnapshot = await getDocs(q);
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      
      // Client-side sıralama
      postsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      console.log('UserProfilePage - Bulunan blog yazıları:', postsData.length);
      setPosts(postsData);
    } catch (e) {
      console.error('UserProfilePage - Hata:', e);
      setError('Profil veya blog yazıları yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
  }
  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }
  if (!profile) {
    return <Container sx={{ py: 4 }}><Alert severity="warning">Kullanıcı profili bulunamadı.</Alert></Container>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, pb: { xs: 6, md: 8 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 6,
          mb: 6,
          borderRadius: 4,
          textAlign: 'center'
        }}
      >
        <Avatar 
          src={profile.photoURL} 
          sx={{ 
            width: 120, 
            height: 120, 
            mb: 3,
            border: '4px solid white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }} 
        />
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          {profile.displayName || 'İsimsiz Kullanıcı'}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          {profile.bio || 'Bu kullanıcı henüz bir bio eklememiş.'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          {profile.school && (
            <Chip 
              label={profile.school} 
              color="primary" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          )}
          {profile.birthPlace && (
            <Chip 
              label={profile.birthPlace} 
              color="secondary" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            📝 {posts.length} Blog Yazısı
          </Typography>
          {currentUser && currentUser.uid === userId && (
            <Button 
              variant="outlined" 
              onClick={() => navigate('/profile/edit')}
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Profili Düzenle
            </Button>
          )}
        </Box>
      </Box>

      {/* Blog Yazıları Bölümü */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Blog Yazıları
        </Typography>
        {posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Henüz blog yazısı yok
            </Typography>
            {currentUser && currentUser.uid === userId && (
              <Button 
                variant="contained" 
                onClick={() => navigate('/blog')}
              >
                İlk Yazıyı Ekle
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid xs={12} md={6} lg={4} key={post.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Chip label={post.category} color="primary" size="small" />
                    </Box>
                    <Typography variant="h6" gutterBottom>{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleString('tr-TR') : ''}
                      {post.likeCount > 0 && ` • ❤️ ${post.likeCount}`}
                      {post.commentCount > 0 && ` • 💬 ${post.commentCount}`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/blog/${post.id}`)}>
                      Devamını Oku
                    </Button>
                    {currentUser && currentUser.uid === userId && (
                      <Button size="small" onClick={() => navigate(`/blog/edit/${post.id}`)}>
                        Düzenle
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default UserProfilePage; 