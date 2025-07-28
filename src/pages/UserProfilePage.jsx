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
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Message as MessageIcon, CameraAlt as CameraIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc } from 'firebase/firestore';
import FollowersModal from '../components/FollowersModal';
import { getFollowers, getFollowing, isFollowing, followUser, unfollowUser } from '../services/followService';
import ImageUpload from '../components/ImageUpload';

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
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);

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

  const handlePhotoUpdate = async (photoURL) => {
    if (!currentUser || currentUser.uid !== userId) return;
    
    try {
      setUpdatingPhoto(true);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { photoURL });
      
      // Profili güncelle
      setProfile(prev => ({ ...prev, photoURL }));
      
      setPhotoDialogOpen(false);
    } catch (error) {
      console.error('Profil fotoğrafı güncellenirken hata:', error);
      alert('Profil fotoğrafı güncellenirken bir hata oluştu.');
    } finally {
      setUpdatingPhoto(false);
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
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, md: 4 }, 
      px: { xs: 1, md: 2 }, 
      width: '100%', 
      boxSizing: 'border-box', 
      minHeight: 'calc(100vh - 120px)',
      bgcolor: 'white'
    }}>
      {/* Kullanıcı Bilgileri */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        {/* Profil Fotoğrafı ve Kamera Simgesi */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar 
            src={profile.photoURL} 
            sx={{ width: 120, height: 120, border: '3px solid #5A0058', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} 
          />
          {currentUser && currentUser.uid === userId && (
            <IconButton
              onClick={() => setPhotoDialogOpen(true)}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: '#5A0058',
                color: 'white',
                width: 36,
                height: 36,
                border: '2px solid white',
                '&:hover': {
                  bgcolor: '#4A0047'
                }
              }}
            >
              <CameraIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        
        {/* Kullanıcı Adı */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
          {profile.displayName || profile.username || ((profile.firstName || '') + ' ' + (profile.lastName || '')).trim() || profile.email || 'İsimsiz Kullanıcı'}
        </Typography>
        
        {/* Takipçi ve Takip Edilen */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
          <Button 
            variant="text" 
            onClick={() => setFollowersModalOpen(true)} 
            sx={{ 
              p: 0, 
              minWidth: 0, 
              color: '#5A0058', 
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(90, 0, 88, 0.04)',
                color: '#4A0047'
              }
            }}
          >
            {followers.length} Takipçi
          </Button>
          <Typography variant="body2" color="text.secondary">•</Typography>
          <Button 
            variant="text" 
            onClick={() => setFollowersModalOpen(true)} 
            sx={{ 
              p: 0, 
              minWidth: 0, 
              color: '#5A0058', 
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(90, 0, 88, 0.04)',
                color: '#4A0047'
              }
            }}
          >
            {following.length} Takip Edilen
          </Button>
        </Box>
        
        {/* Profili Düzenle Butonu */}
        {currentUser && currentUser.uid === userId && (
          <Button 
            variant="outlined" 
            onClick={() => navigate('/profile/edit')}
            sx={{ fontWeight: 600, borderColor: '#5A0058', color: '#5A0058', '&:hover': { bgcolor: '#5A0058', color: 'white', borderColor: '#5A0058' } }}
          >
            Profili Düzenle
          </Button>
        )}
        
        {/* Diğer kullanıcı için takip et ve mesaj gönder butonları */}
        {currentUser && currentUser.uid !== userId && (
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {isUserFollowing ?
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleUnfollow}
                sx={{ 
                  borderColor: '#5A0058', 
                  color: '#5A0058', 
                  '&:hover': { 
                    bgcolor: '#5A0058', 
                    color: 'white', 
                    borderColor: '#5A0058' 
                  } 
                }}
              >
                Takibi Bırak
              </Button>
              :
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleFollow}
                sx={{ 
                  bgcolor: '#5A0058', 
                  '&:hover': { 
                    bgcolor: '#4A0047' 
                  } 
                }}
              >
                Takip Et
              </Button>
            }
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<MessageIcon />}
              onClick={() => navigate('/messages', { state: { selectedUser: { id: userId, displayName: profile.displayName || profile.username || profile.email } } })}
              sx={{ 
                borderColor: '#5A0058', 
                color: '#5A0058', 
                '&:hover': { 
                  bgcolor: '#5A0058', 
                  color: 'white', 
                  borderColor: '#5A0058' 
                } 
              }}
            >
              Mesaj Gönder
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Bloglar */}
      <Box>
          {/* Bloglar başlığı ve sekmeler */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Bloglar</Typography>
            {currentUser && currentUser.uid === userId && (
              <Button 
                variant="contained" 
                onClick={() => navigate('/blog/edit')}
                sx={{ 
                  bgcolor: '#5A0058', 
                  '&:hover': { 
                    bgcolor: '#4A0047' 
                  } 
                }}
              >
                Yeni Blog Yaz
              </Button>
            )}
          </Box>
          
          {/* Sekmeler - herkese göster */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: '#666',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#5A0058',
                    backgroundColor: 'rgba(90, 0, 88, 0.04)'
                  },
                  '&.Mui-selected': {
                    color: '#5A0058',
                    fontWeight: 700
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#5A0058'
                }
              }}
            >
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
                  sx={{ 
                    bgcolor: '#5A0058', 
                    '&:hover': { 
                      bgcolor: '#4A0047' 
                    } 
                  }}
                >
                  İlk Yazıyı Ekle
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Sol Sütun */}
                <Box sx={{ flex: 1 }}>
                  {posts.filter((_, index) => index % 2 === 0).map((post) => (
                    <Card key={post.id} sx={{ 
                      mb: 3,
                      height: 400,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'white',
                      border: '2px solid #5A0058',
                      borderRadius: 2,
                      boxShadow: '0 4px 8px rgba(90, 0, 88, 0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 12px rgba(90, 0, 88, 0.2)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={post.category} 
                            sx={{ 
                              bgcolor: '#87CEEB', 
                              color: '#333',
                              fontWeight: 600
                            }} 
                            size="small" 
                          />
                        </Box>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            color: '#5A0058',
                            fontWeight: 700,
                            mb: 2
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          paragraph
                          sx={{ 
                            color: '#333',
                            fontWeight: 500,
                            lineHeight: 1.6,
                            flexGrow: 1
                          }}
                        >
                          {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                        </Typography>
                        <Typography 
                          variant="caption"
                          sx={{ 
                            color: '#555',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleString('tr-TR') : ''}
                          {post.likeCount > 0 && ` • ❤️ ${post.likeCount}`}
                          {post.commentCount > 0 && ` • 💬 ${post.commentCount}`}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/blog/${post.id}`)}
                          sx={{
                            color: '#5A0058',
                            borderColor: '#5A0058',
                            '&:hover': {
                              bgcolor: '#5A0058',
                              color: 'white'
                            }
                          }}
                          variant="outlined"
                        >
                          Devamını Oku
                        </Button>
                        {currentUser && currentUser.uid === userId && (
                          <Button 
                            size="small" 
                            onClick={() => navigate(`/blog/edit/${post.id}`)}
                            sx={{
                              color: '#5A0058',
                              borderColor: '#5A0058',
                              '&:hover': {
                                bgcolor: '#5A0058',
                                color: 'white'
                              }
                            }}
                            variant="outlined"
                          >
                            Düzenle
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  ))}
                </Box>
                
                {/* Sağ Sütun */}
                <Box sx={{ flex: 1 }}>
                  {posts.filter((_, index) => index % 2 === 1).map((post) => (
                    <Card key={post.id} sx={{ 
                      mb: 3,
                      height: 400,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'white',
                      border: '2px solid #5A0058',
                      borderRadius: 2,
                      boxShadow: '0 4px 8px rgba(90, 0, 88, 0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 12px rgba(90, 0, 88, 0.2)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={post.category} 
                            sx={{ 
                              bgcolor: '#87CEEB', 
                              color: '#333',
                              fontWeight: 600
                            }} 
                            size="small" 
                          />
                        </Box>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            color: '#5A0058',
                            fontWeight: 700,
                            mb: 2
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          paragraph
                          sx={{ 
                            color: '#333',
                            fontWeight: 500,
                            lineHeight: 1.6,
                            flexGrow: 1
                          }}
                        >
                          {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                        </Typography>
                        <Typography 
                          variant="caption"
                          sx={{ 
                            color: '#555',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleString('tr-TR') : ''}
                          {post.likeCount > 0 && ` • ❤️ ${post.likeCount}`}
                          {post.commentCount > 0 && ` • 💬 ${post.commentCount}`}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/blog/${post.id}`)}
                          sx={{
                            color: '#5A0058',
                            borderColor: '#5A0058',
                            '&:hover': {
                              bgcolor: '#5A0058',
                              color: 'white'
                            }
                          }}
                          variant="outlined"
                        >
                          Devamını Oku
                        </Button>
                        {currentUser && currentUser.uid === userId && (
                          <Button 
                            size="small" 
                            onClick={() => navigate(`/blog/edit/${post.id}`)}
                            sx={{
                              color: '#5A0058',
                              borderColor: '#5A0058',
                              '&:hover': {
                                bgcolor: '#5A0058',
                                color: 'white'
                              }
                            }}
                            variant="outlined"
                          >
                            Düzenle
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              </Box>
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
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Sol Sütun */}
              <Box sx={{ flex: 1 }}>
                {savedPosts.filter((_, index) => index % 2 === 0).map((post) => (
                  <Card key={post.id} sx={{ 
                    mb: 3,
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'white',
                    border: '2px solid #5A0058',
                    borderRadius: 2,
                    boxShadow: '0 4px 8px rgba(90, 0, 88, 0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(90, 0, 88, 0.2)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={post.category || 'Genel'} 
                          sx={{ 
                            bgcolor: '#87CEEB', 
                            color: '#333',
                            fontWeight: 600
                          }} 
                          size="small" 
                        />
                      </Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          color: '#5A0058',
                          fontWeight: 700,
                          mb: 2
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        paragraph
                        sx={{ 
                          color: '#333',
                          fontWeight: 500,
                          lineHeight: 1.6,
                          flexGrow: 1
                        }}
                      >
                        {post.content && post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{ 
                          color: '#555',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {post.authorName && `Yazar: ${post.authorName}`}
                        {post.createdAt?.toDate?.() && ` • ${post.createdAt.toDate().toLocaleString('tr-TR')}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/blog/${post.id}`)}
                        sx={{
                          color: '#5A0058',
                          borderColor: '#5A0058',
                          '&:hover': {
                            bgcolor: '#5A0058',
                            color: 'white'
                          }
                        }}
                        variant="outlined"
                      >
                        Devamını Oku
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
              
              {/* Sağ Sütun */}
              <Box sx={{ flex: 1 }}>
                {savedPosts.filter((_, index) => index % 2 === 1).map((post) => (
                  <Card key={post.id} sx={{ 
                    mb: 3,
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'white',
                    border: '2px solid #5A0058',
                    borderRadius: 2,
                    boxShadow: '0 4px 8px rgba(90, 0, 88, 0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(90, 0, 88, 0.2)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={post.category || 'Genel'} 
                          sx={{ 
                            bgcolor: '#87CEEB', 
                            color: '#333',
                            fontWeight: 600
                          }} 
                          size="small" 
                        />
                      </Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          color: '#5A0058',
                          fontWeight: 700,
                          mb: 2
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        paragraph
                        sx={{ 
                          color: '#333',
                          fontWeight: 500,
                          lineHeight: 1.6,
                          flexGrow: 1
                        }}
                      >
                        {post.content && post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{ 
                          color: '#555',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {post.authorName && `Yazar: ${post.authorName}`}
                        {post.createdAt?.toDate?.() && ` • ${post.createdAt.toDate().toLocaleString('tr-TR')}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/blog/${post.id}`)}
                        sx={{
                          color: '#5A0058',
                          borderColor: '#5A0058',
                          '&:hover': {
                            bgcolor: '#5A0058',
                            color: 'white'
                          }
                        }}
                        variant="outlined"
                      >
                        Devamını Oku
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Box>
          )
        )}
      </Box>
    </Box>
    <FollowersModal
      open={followersModalOpen}
      onClose={() => setFollowersModalOpen(false)}
      followers={followers}
      following={following}
      loading={followersLoading}
    />

    {/* Profil Fotoğrafı Yükleme Dialogu */}
    <Dialog
      open={photoDialogOpen}
      onClose={() => setPhotoDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ color: '#5A0058', fontWeight: 'bold', textAlign: 'center' }}>
        📸 Profil Fotoğrafını Güncelle
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <ImageUpload
            currentImageUrl={profile.photoURL}
            onImageUpload={handlePhotoUpdate}
            onImageDelete={() => handlePhotoUpdate('')}
            size="large"
            showPreview={true}
            disabled={updatingPhoto}
          />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            Profil fotoğrafınızı galeriden seçebilir veya kamera ile çekebilirsiniz
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={() => setPhotoDialogOpen(false)}
          disabled={updatingPhoto}
          sx={{ color: 'text.secondary' }}
        >
          İptal
        </Button>
      </DialogActions>
    </Dialog>
  </Container>
  );
}

export default UserProfilePage; 