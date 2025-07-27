import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Divider,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { collection, getDoc, deleteDoc, getDocs, query, where, limit, orderBy, doc, setDoc, deleteField, onSnapshot, addDoc } from 'firebase/firestore';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthorInfoCard from '../components/AuthorInfoCard';
import ShareButtons from '../components/ShareButtons';
import RelatedPostsList from '../components/RelatedPostsList';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useReadingTime from '../hooks/useReadingTime';


function BlogDetailPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [openComments, setOpenComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [userSaved, setUserSaved] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // Gerçek okuma süresi için ref ve hook
  const contentRef = useRef(null);
    const {
    readingTime,
    totalReadingTime,
    isReading, 
    progress, 
    formatReadingTime,
    formatTotalReadingTime
  } = useReadingTime(contentRef, postId);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('BlogDetailPage - Gelen postId:', postId);
    if (!postId) {
      setError('Geçersiz blog yazısı.');
      setLoading(false);
      return;
    }
    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (post) {
      // Basit ve güvenilir okuma süresi hesaplama
      const calculateReadingTime = (content) => {
        if (!content || content.trim().length === 0) {
          return 1;
        }
        
        // Kelime sayısını hesapla
        const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        // Ortalama okuma hızı: 200 kelime/dakika
        const readingSpeed = 200;
        
        // Okuma süresini hesapla
        const readingTime = Math.ceil(words / readingSpeed);
        
        // Debug bilgisi
        console.log('Okuma süresi hesaplama:', {
          contentLength: content.length,
          wordCount: words,
          readingSpeed: readingSpeed,
          calculatedTime: words / readingSpeed,
          finalTime: Math.max(1, readingTime)
        });
        
        // Minimum 1 dakika olsun
        return Math.max(1, readingTime);
      };
      
      const estimatedTime = calculateReadingTime(post.content);
      setEstimatedReadingTime(estimatedTime);
      fetchRelatedPosts();
    }
  }, [post]);

  useEffect(() => {
    // Beğeni listener
    if (postId) {
      const likesRef = collection(db, 'blog-posts', postId, 'likes');
      const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
        setLikeCount(snapshot.size);
        if (user) {
          setUserLiked(snapshot.docs.some(doc => doc.id === user.uid));
        } else {
          setUserLiked(false);
        }
      });
      return () => {
        unsubscribeLikes();
      };
    }
  }, [postId, user]);

  useEffect(() => {
    // Yorum sayısı listener
    if (postId) {
      const commentsRef = collection(db, 'blog-posts', postId, 'comments');
      const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
        setCommentCount(snapshot.size);
      });
      return () => {
        unsubscribeComments();
      };
    }
  }, [postId]);

  useEffect(() => {
    // Kaydetme durumu listener
    if (postId && user) {
      const savedRef = collection(db, 'savedpost');
      const unsubscribeSaved = onSnapshot(savedRef, (snapshot) => {
        const isSaved = snapshot.docs.some(doc => {
          const data = doc.data();
          return data.saverId === user.uid && data.savedId === postId;
        });
        setUserSaved(isSaved);
      });
      return () => {
        unsubscribeSaved();
      };
    } else {
      setUserSaved(false);
    }
  }, [postId, user]);

  // Yorumlar listener
  useEffect(() => {
    if (postId && openComments) {
      const commentsRef = collection(db, 'blog-posts', postId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCommentsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [postId, openComments]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Blog yazısı getiriliyor:', postId);
      const postRef = doc(db, 'blog-posts', postId);
      const postSnap = await getDoc(postRef);
 
      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() };
        if (!postData.category) postData.category = 'genel';
        
        // totalReadingTime'ı Firestore'dan kaldır, Realtime Database'den gelecek
        delete postData.totalReadingTime;
        
        setPost(postData);
        console.log('BlogDetailPage - Firestore post id:', postSnap.id);
        console.log('Çekilen post (totalReadingTime hariç):', postData);
      } else {
        console.log('Firestore: Doküman bulunamadı:', postId);
        setError('Blog yazısı bulunamadı.');
      }
    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error);
      setError('Blog yazısı yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    if (!post) return;
    try {
      const postsRef = collection(db, 'blog-posts');
      const q = query(
        postsRef,
        where('category', '==', post.category),
        where('__name__', '!=', postId),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const snapshot = await getDocs(q);
      const related = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRelatedPosts(related);
    } catch (error) {
      // Hata yönetimi
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'blog-posts', postId));
        navigate('/blog');
      } catch (error) {
        setError('Blog yazısı silinirken bir hata oluştu.');
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post.title;
    const text = post.content.substring(0, 100) + '...';
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link kopyalandı!');
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleLike = async () => {
    if (!user) return;
    const likeRef = doc(db, 'blog-posts', postId, 'likes', user.uid);
    if (userLiked) {
      // Beğeniyi kaldır
      await deleteDoc(likeRef);
    } else {
      // Beğeni ekle
      await setDoc(likeRef, { likedAt: new Date() });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      if (userSaved) {
        // Kaydedilmiş kaydı bul ve sil
        const savedRef = collection(db, 'savedpost');
        const q = query(savedRef, 
          where('saverId', '==', user.uid),
          where('savedId', '==', postId)
        );
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'savedpost', docSnapshot.id));
        });
      } else {
        // Yeni kaydet kaydı oluştur
        await addDoc(collection(db, 'savedpost'), {
          saverId: user.uid,
          savedId: postId,
          postTitle: post.title,
          postAuthor: post.authorName,
          savedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Kaydet işlemi hatası:', error);
    }
  };

  const handleOpenComments = () => {
    setOpenComments(true);
    // Yorumların açılması için bir state yönetimi veya doğrudan yorumların gösterilmesi
    // Bu örnekte, yorumların açılması için bir modal veya yeni bir sayfa açılması yeterli olabilir.
    // Şimdilik sadece state'i değiştirerek yorumların açılmasını sağladık.
  };

  // Yorum ekleme fonksiyonu
  const handleAddComment = async () => {
    if (!user || !commentText.trim()) return;
    await addDoc(collection(db, 'blog-posts', postId, 'comments'), {
      userId: user.uid,
      displayName: user.displayName || user.username || user.email,
      comment: commentText,
      createdAt: new Date()
    });
    setCommentText("");
  };

  const formatDate = (date) => {
    if (!date) return '';
    // Firestore Timestamp ise
    if (typeof date.toDate === 'function') {
      return new Date(date.toDate()).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // String veya Date ise
    return new Date(date).toLocaleDateString('tr-TR', {
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
      diğer: 'info'
    };
    return colors[category] || 'default';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      teknoloji: '💻',
      yaşam: '🌟',
      eğitim: '📚',
      seyahat: '✈️',
      yemek: '🍽️',
      kişisel: '💪',
      genel: '📝',
      diğer: '📄'
    };
    return icons[category] || '📄';
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
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
          Blog'a Dön
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, color: '#5A0058', fontWeight: 600 }}>
          Blog yazısı bulunamadı.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
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
          Blog'a Dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ 
      py: { xs: 2, md: 3 }, 
      pb: { xs: 6, md: 8 }, 
      px: { xs: 1, md: 2 }, 
      width: '100%', 
      boxSizing: 'border-box', 
      minHeight: 'calc(100vh - 120px)', 
      bgcolor: 'white' 
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          component={RouterLink} 
          to="/" 
          sx={{ 
            color: '#5A0058', 
            textDecoration: 'none',
            '&:hover': {
              color: '#4A0047',
              textDecoration: 'underline'
            }
          }}
        >
          Anasayfa
        </Link>
        <Link 
          component={RouterLink} 
          to="/blog" 
          sx={{ 
            color: '#5A0058', 
            textDecoration: 'none',
            '&:hover': {
              color: '#4A0047',
              textDecoration: 'underline'
            }
          }}
        >
          Blog
        </Link>
        <Typography sx={{ color: '#5A0058', fontWeight: 600 }}>{post.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
        {/* Ana İçerik Alanı */}
        <Grid item xs={12} lg={8}>
          {/* Blog Yazısı Kartı */}
          <Card sx={{ 
            mb: 4,
            bgcolor: 'white',
            border: '3px solid #5A0058',
            borderRadius: 3,
            boxShadow: '0 8px 16px rgba(90, 0, 88, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Blog Başlığı ve Meta Bilgileri */}
            <Box sx={{ 
              p: 4, 
              pb: 3,
              borderBottom: '2px solid rgba(90, 0, 88, 0.1)',
              bgcolor: 'rgba(90, 0, 88, 0.02)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h4" component="span" sx={{ color: '#5A0058' }}>
                  {getCategoryIcon(post.category)}
                </Typography>
                <Chip
                  label={post.category}
                  sx={{
                    bgcolor: '#87CEEB',
                    color: '#333',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                  size="medium"
                />
              </Box>
              
              <Typography variant="h3" component="h1" gutterBottom sx={{ 
                fontWeight: 700, 
                lineHeight: 1.2,
                color: '#5A0058',
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}>
                {post.title}
              </Typography>
              
              {/* Meta Bilgiler */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 3, 
                mb: 2, 
                flexWrap: 'wrap',
                p: 2,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid rgba(90, 0, 88, 0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: '#5A0058' }} />
                  <Typography variant="body2" sx={{ color: '#5A0058', fontWeight: 600 }}>
                    {formatTotalReadingTime(totalReadingTime)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon fontSize="small" sx={{ color: '#5A0058' }} />
                  <Typography variant="body2" sx={{ color: '#5A0058', fontWeight: 600 }}>
                    {formatDate(post.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FavoriteIcon fontSize="small" sx={{ color: '#5A0058' }} />
                  <Typography variant="body2" sx={{ color: '#5A0058', fontWeight: 600 }}>
                    {likeCount} Beğeni
                  </Typography>
                </Box>
                {commentCount > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CommentIcon fontSize="small" sx={{ color: '#5A0058' }} />
                    <Typography variant="body2" sx={{ color: '#5A0058', fontWeight: 600 }}>
                      {commentCount} yorum
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {post.updatedAt && post.updatedAt.toDate().getTime() !== post.createdAt.toDate().getTime() && (
                <Typography variant="caption" sx={{ 
                  color: '#5A0058', 
                  fontWeight: 600,
                  fontStyle: 'italic'
                }}>
                  Son güncelleme: {formatDate(post.updatedAt)}
                </Typography>
              )}
            </Box>

            {/* Blog İçeriği */}
            <CardContent ref={contentRef} sx={{ p: 4, pt: 3, maxHeight: '60vh', overflowY: 'auto' }}>
              
              <Box sx={{ 
                lineHeight: 1.8, 
                fontSize: '1.1rem',
                color: '#333',
                fontWeight: 400,
                textAlign: 'justify',
                mb: 2
              }}>
                {post.content.split('\n').map((paragraph, index) => (
                  <Typography key={index} variant="body1" paragraph sx={{ 
                    lineHeight: 1.8, 
                    fontSize: '1.1rem',
                    color: '#333',
                    fontWeight: 400,
                    textAlign: 'justify',
                    mb: 1
                  }}>
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            </CardContent>

            {/* Etkileşim Butonları */}
            <Box sx={{ 
              p: 3, 
              pt: 0,
              borderTop: '2px solid rgba(90, 0, 88, 0.1)',
              bgcolor: 'rgba(90, 0, 88, 0.02)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box
                  onClick={handleOpenComments}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(90, 0, 88, 0.1)'
                    }
                  }}
                >
                  <span style={{ fontSize: 22, color: '#5A0058', marginRight: 4 }}>💬</span>
                  <Typography variant="body2" sx={{ color: '#5A0058', fontWeight: 600 }}>
                    {commentCount} yorum
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Kaydet butonu */}
                  <Box
                    onClick={user ? handleSave : undefined}
                    sx={{
                      cursor: user ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: user ? 'rgba(90, 0, 88, 0.1)' : 'none'
                      }
                    }}
                  >
                    {userSaved ? (
                      <BookmarkIcon sx={{ color: '#ff9800', fontSize: 24 }} />
                    ) : (
                      <BookmarkBorderIcon sx={{ color: '#5A0058', fontSize: 24 }} />
                    )}
                  </Box>
                  
                  {/* Beğeni butonu */}
                  <Box
                    onClick={user ? handleLike : undefined}
                    sx={{
                      cursor: user ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: user ? 'rgba(90, 0, 88, 0.1)' : 'none'
                      }
                    }}
                  >
                    {userLiked ? (
                      <FavoriteIcon sx={{ color: '#5A0058', fontSize: 24 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: '#5A0058', fontSize: 24 }} />
                    )}
                    <Typography variant="body2" sx={{ ml: 0.5, color: '#5A0058', fontWeight: 600 }}>
                      {likeCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Yazar Hakkında ve Paylaş Bölümü - Yan Yana */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <AuthorInfoCard
                authorName={post.authorName}
                authorPhotoURL={post.authorPhotoURL}
                authorId={post.authorId}
                navigate={navigate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ShareButtons handleShare={handleShare} />
            </Grid>
          </Grid>

          {/* Yorumlar Bölümü */}
          {openComments && (
            <Card sx={{ 
              mb: 4,
              bgcolor: 'white',
              border: '3px solid #5A0058',
              borderRadius: 3,
              boxShadow: '0 8px 16px rgba(90, 0, 88, 0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: '#5A0058', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CommentIcon sx={{ color: '#5A0058' }} />
                  Yorumlar ({commentCount})
                </Typography>
                
                <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 3 }}>
                  {commentsList.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: '#5A0058',
                      fontStyle: 'italic'
                    }}>
                      <Typography variant="body1">Henüz yorum yok.</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        İlk yorumu siz yapın!
                      </Typography>
                    </Box>
                  ) : (
                    commentsList.map(c => (
                      <Box key={c.id} sx={{ 
                        mb: 2, 
                        p: 3, 
                        borderRadius: 2, 
                        bgcolor: 'rgba(90, 0, 88, 0.05)',
                        border: '1px solid rgba(90, 0, 88, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 2,
                            bgcolor: '#5A0058',
                            fontSize: '0.9rem'
                          }}>
                            {(c.displayName || 'Kullanıcı').charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ 
                            color: '#5A0058', 
                            fontWeight: 600 
                          }}>
                            {c.displayName || 'Kullanıcı'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ 
                          color: '#333', 
                          mb: 1,
                          lineHeight: 1.6
                        }}>
                          {c.comment}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#5A0058', 
                          opacity: 0.7 
                        }}>
                          {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString('tr-TR') : ''}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
                
                {user ? (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    p: 3,
                    bgcolor: 'rgba(90, 0, 88, 0.02)',
                    borderRadius: 2,
                    border: '1px solid rgba(90, 0, 88, 0.1)'
                  }}>
                    <input
                      type="text"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Yorumunuzu yazın..."
                      style={{ 
                        flex: 1, 
                        padding: 12, 
                        borderRadius: 8, 
                        border: '2px solid #87CEEB',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#5A0058'}
                      onBlur={(e) => e.target.style.borderColor = '#87CEEB'}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleAddComment} 
                      disabled={!commentText.trim()} 
                      sx={{ 
                        bgcolor: '#5A0058',
                        px: 3,
                        '&:hover': {
                          bgcolor: '#4A0047'
                        },
                        '&:disabled': {
                          bgcolor: '#ccc'
                        }
                      }}
                    >
                      Gönder
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 3,
                    bgcolor: 'rgba(90, 0, 88, 0.02)',
                    borderRadius: 2,
                    border: '1px solid rgba(90, 0, 88, 0.1)'
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: '#5A0058', 
                      fontWeight: 600,
                      mb: 1
                    }}>
                      Yorum yapmak için giriş yapmalısınız.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: '#5A0058',
                        color: '#5A0058',
                        '&:hover': {
                          bgcolor: '#5A0058',
                          color: 'white'
                        }
                      }}
                    >
                      Giriş Yap
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Aksiyon Butonları */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            mt: 4,
            p: 3,
            bgcolor: 'rgba(90, 0, 88, 0.02)',
            borderRadius: 3,
            border: '2px solid rgba(90, 0, 88, 0.1)'
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/blog')}
              sx={{
                borderColor: '#5A0058',
                color: '#5A0058',
                px: 3,
                '&:hover': {
                  bgcolor: '#5A0058',
                  color: 'white',
                  borderColor: '#5A0058'
                }
              }}
            >
              Blog'a Dön
            </Button>
            {user && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/blog/edit/${postId}`)}
                  sx={{
                    borderColor: '#5A0058',
                    color: '#5A0058',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#5A0058',
                      color: 'white',
                      borderColor: '#5A0058'
                    }
                  }}
                >
                  Düzenle
                </Button>



                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeletePost}
                  sx={{
                    borderColor: '#e53935',
                    color: '#e53935',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#e53935',
                      color: 'white',
                      borderColor: '#e53935'
                    }
                  }}
                >
                  Sil
                </Button>

              </>
            )}
          </Box>
        </Grid>

        {/* Sağ Sidebar - Sadece İlgili Yazılar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ 
            position: 'sticky', 
            top: 20
          }}>
            <RelatedPostsList
              relatedPosts={relatedPosts}
              navigate={navigate}
              formatDate={formatDate}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default BlogDetailPage; 