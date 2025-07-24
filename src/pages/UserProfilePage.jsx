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
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import FollowersModal from '../components/FollowersModal';
import { getFollowers, getFollowing, isFollowing, followUser, unfollowUser } from '../services/followService';

function UserProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    console.log('UserProfilePage - userId:', userId);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchProfileAndPosts();
    fetchFollowersData();
    // Her kullanıcı için kaydedilen yazıları çek
    fetchSavedPosts();
    // eslint-disable-next-line
  }, [userId, currentUser]);

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
        postsData.push({ ...doc.data(), id: doc.id });
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

  const fetchSavedPosts = async () => {
    try {
      // savedpost koleksiyonundan bu kullanıcının kaydettiği yazıları çek (herkese açık)
      const savedRef = collection(db, 'savedpost');
      const q = query(savedRef, where('saverId', '==', userId));
      const savedSnapshot = await getDocs(q);
      const savedPostIds = savedSnapshot.docs.map(doc => doc.data().savedId);
      
      if (savedPostIds.length > 0) {
        const savedPostsData = [];
        
        // Her kaydedilen post için ayrı ayrı getDoc çağrısı yap
        for (const postId of savedPostIds) {
          const postRef = doc(db, 'blog-posts', postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            savedPostsData.push({ ...postSnap.data(), id: postSnap.id });
          }
        }
        
        setSavedPosts(savedPostsData);
      } else {
        setSavedPosts([]);
      }
    } catch (error) {
      console.error('Kaydedilen yazılar yüklenirken hata:', error);
      setSavedPosts([]);
    }
  };

  const fetchFollowersData = async () => {
    setFollowersLoading(true);
    try {
      const [f, g] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId)
      ]);
      setFollowers(f);
      setFollowing(g);
      if (currentUser && currentUser.uid !== userId) {
        setIsUserFollowing(await isFollowing(currentUser.uid, userId));
      }
    } finally {
      setFollowersLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    await followUser(currentUser.uid, userId);
    setIsUserFollowing(true);
    fetchFollowersData();
  };
  const handleUnfollow = async () => {
    if (!currentUser) return;
    await unfollowUser(currentUser.uid, userId);
    setIsUserFollowing(false);
    fetchFollowersData();
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
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      {/* Profil Üst Kısım */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4, bgcolor: 'white', p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Avatar 
          src={profile.photoURL} 
          sx={{ width: 100, height: 100, border: '3px solid #4E342E', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} 
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {profile.displayName || profile.username || ((profile.firstName || '') + ' ' + (profile.lastName || '')).trim() || profile.email || 'İsimsiz Kullanıcı'}
            </Typography>
            {currentUser && currentUser.uid !== userId && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isUserFollowing ?
                  <Button variant="outlined" color="secondary" size="small" onClick={handleUnfollow}>Takibi Bırak</Button>
                  :
                  <Button variant="contained" color="primary" size="small" onClick={handleFollow}>Takip Et</Button>
                }
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  startIcon={<MessageIcon />}
                  onClick={() => navigate('/messages', { state: { selectedUser: { id: userId, displayName: profile.displayName || profile.username || profile.email } } })}
                >
                  Mesaj Gönder
                </Button>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Button variant="text" color="inherit" onClick={() => setFollowersModalOpen(true)} sx={{ p: 0, minWidth: 0, color: '#4E342E', fontWeight: 600 }}>
              {followers.length} Takipçi
            </Button>
            <Typography variant="body2" color="text.secondary">•</Typography>
            <Button variant="text" color="inherit" onClick={() => setFollowersModalOpen(true)} sx={{ p: 0, minWidth: 0, color: '#4E342E', fontWeight: 600 }}>
              {following.length} Takip Edilen
            </Button>
          </Box>
          {currentUser && currentUser.uid === userId && (
            <Button 
              variant="outlined" 
              onClick={() => navigate('/profile/edit')}
              sx={{ mt: 1, fontWeight: 600, borderColor: '#4E342E', color: '#4E342E', '&:hover': { bgcolor: '#f5f5f5', borderColor: '#4E342E' } }}
            >
              Profili Düzenle
            </Button>
          )}
        </Box>
      </Box>
      {/* Bio ve etiketler */}
      <Box sx={{ mb: 3, px: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {profile.bio || 'Bu kullanıcı henüz bir bio eklememiş.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {profile.school && (
            <Chip label={profile.school} color="primary" size="small" />
          )}
          {profile.birthPlace && (
            <Chip label={profile.birthPlace} color="secondary" size="small" />
          )}
        </Box>
      </Box>
      {/* Bloglar başlığı ve sekmeler */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Bloglar</Typography>
        {currentUser && currentUser.uid === userId && (
          <Button variant="contained" color="primary" onClick={() => navigate('/blog/edit')}>
            Yeni Blog Yaz
          </Button>
        )}
      </Box>
      
      {/* Sekmeler - herkese göster */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={currentUser && currentUser.uid === userId ? `Bloglarım (${posts.length})` : `Blogları (${posts.length})`} />
          <Tab label={`Kaydettikleri (${savedPosts.length})`} />
        </Tabs>
      </Box>
      {/* Bloglar - Sekme içeriği */}
      <Box>
          {tabValue === 0 && (
            // Bloglarım sekmesi
            posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Henüz blog yazısı yok
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/blog/edit')}
                >
                  İlk Yazıyı Ekle
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {posts.map((post) => (
                  <Grid item xs={12} md={6} key={post.id}>
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
                        <Button size="small" onClick={() => navigate(`/blog/edit/${post.id}`)}>
                          Düzenle
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )
          )}
          
        {tabValue === 1 && (
          // Kaydettikleri sekmesi (herkese açık)
          savedPosts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {currentUser && currentUser.uid === userId 
                  ? 'Henüz kaydedilen yazı yok' 
                  : 'Bu kullanıcı henüz yazı kaydetmemiş'
                }
              </Typography>
              {currentUser && currentUser.uid === userId && (
                <Typography variant="body2" color="text.secondary">
                  Beğendiğiniz yazıları kaydetmek için bookmark ikonuna tıklayın
                </Typography>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {savedPosts.map((post) => (
                <Grid item xs={12} md={6} key={post.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip label={post.category || 'Genel'} color="primary" size="small" />
                      </Box>
                      <Typography variant="h6" gutterBottom>{post.title}</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {post.content && post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.authorName && `Yazar: ${post.authorName}`}
                        {post.createdAt?.toDate?.() && ` • ${post.createdAt.toDate().toLocaleString('tr-TR')}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => navigate(`/blog/${post.id}`)}>
                        Devamını Oku
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}
      </Box>
      <FollowersModal
        open={followersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
        followers={followers}
        following={following}
        loading={followersLoading}
      />
    </Container>
  );
}

export default UserProfilePage; 