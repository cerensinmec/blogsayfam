import React, { useState, useEffect } from 'react';
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
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { collection, getDoc, deleteDoc, getDocs, query, where, limit, orderBy, doc, setDoc, deleteField, onSnapshot, addDoc } from 'firebase/firestore';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthorInfoCard from '../components/AuthorInfoCard';
import ShareButtons from '../components/ShareButtons';
import RelatedPostsList from '../components/RelatedPostsList';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function BlogDetailPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0); // Yeni eklenen state
  const [openComments, setOpenComments] = useState(false); // Yeni eklenen state
  // Yorum ekleme ve listeleme için gerekli state'ler
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const { postId } = useParams();
  const navigate = useNavigate();

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
      const wordCount = post.content.split(' ').length;
      const estimatedTime = Math.ceil(wordCount / 200);
      setReadingTime(estimatedTime);
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
      console.log('Firestore doc referansı:', postId);
      const postRef = doc(db, 'blog-posts', postId);
      const postSnap = await getDoc(postRef);
      const querySnapshot = await collection(db, "blog-posts");
      console.log('querySnapshot',querySnapshot);
 
      console.log('postSnap ','postId',postSnap,postId);
      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() };
        if (!postData.category) postData.category = 'genel';
        setPost(postData);
        console.log('BlogDetailPage - Firestore post id:', postSnap.id);
        console.log('Çekilen post:', postData);
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
        >
          Blog'a Dön
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Blog yazısı bulunamadı.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
        >
          Blog'a Dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, pb: { xs: 6, md: 8 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          Anasayfa
        </Link>
        <Link component={RouterLink} to="/blog" color="inherit" underline="hover">
          Blog
        </Link>
        <Typography color="text.primary">{post.title}</Typography>
      </Breadcrumbs>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h4" component="span">
                    {getCategoryIcon(post.category)}
                  </Typography>
                  <Chip
                    label={post.category}
                    color={getCategoryColor(post.category)}
                    size="medium"
                  />
                </Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                  {post.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {readingTime} dakika okuma
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {likeCount} Beğeni
                    </Typography>
                  </Box>
                  {post.commentCount > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CommentIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {post.commentCount} yorum
                      </Typography>
                    </Box>
                  )}
                </Box>
                {post.updatedAt && post.updatedAt.toDate().getTime() !== post.createdAt.toDate().getTime() && (
                  <Typography variant="caption" color="text.secondary">
                    Son güncelleme: {formatDate(post.updatedAt)}
                  </Typography>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                {post.content.split('\n').map((paragraph, index) => (
                  <span key={index}>
                    {paragraph}
                    <br />
                  </span>
                ))}
              </Typography>
              {/* Beğeni (kalp ve sayı) alanını ana Box'ın dışına, sayfanın altına taşı. */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
                <Box
                  onClick={user ? handleLike : undefined}
                  sx={{
                    cursor: user ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.1s',
                    '&:active': { transform: user ? 'scale(1.2)' : 'none' }
                  }}
                >
                  {userLiked ? (
                    <FavoriteIcon sx={{ color: '#e53935', fontSize: 24 }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: '#bdbdbd', fontSize: 24 }} />
                  )}
                  <Typography variant="body2" sx={{ ml: 0.5, color: userLiked ? '#e53935' : '#757575', fontWeight: 600 }}>
                    {likeCount}
                  </Typography>
                </Box>
              </Box>
              {/* Blog içeriğinin hemen altına, küçük ve sade bir satırda yorum (💬 ikon ve yorum sayısı) alanı ekle */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box
                  onClick={handleOpenComments}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.1s',
                    '&:active': { transform: 'scale(1.1)' }
                  }}
                >
                  <span style={{ fontSize: 22, color: '#8D6E63', marginRight: 4 }}>💬</span>
                  <Typography variant="body2" sx={{ color: '#8D6E63', fontWeight: 600 }}>
                    {commentCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          {openComments && (
            <Box sx={{ mt: 2, mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fff' }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#8D6E63', fontWeight: 700 }}>Yorumlar</Typography>
              <Box sx={{ maxHeight: 220, overflowY: 'auto', mb: 2 }}>
                {commentsList.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Henüz yorum yok.</Typography>
                ) : (
                  commentsList.map(c => (
                    <Box key={c.id} sx={{ mb: 1.5, p: 1, borderRadius: 1, bgcolor: '#f9f6f4' }}>
                      <Typography variant="subtitle2" sx={{ color: '#8D6E63', fontWeight: 600 }}>{c.displayName || 'Kullanıcı'}</Typography>
                      <Typography variant="body2" sx={{ color: '#333' }}>{c.comment}</Typography>
                      <Typography variant="caption" color="text.secondary">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ''}</Typography>
                    </Box>
                  ))
                )}
              </Box>
              {user ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  <Button variant="contained" onClick={handleAddComment} disabled={!commentText.trim()} sx={{ bgcolor: '#8D6E63' }}>Gönder</Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Yorum yapmak için giriş yapmalısınız.</Typography>
              )}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/blog')}
            >
              Blog'a Dön
            </Button>
            {user && (user.uid === post.authorId || user.email === 'admin@example.com') && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/blog/edit/${postId}`)}
                >
                  Düzenle
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeletePost}
                >
                  Sil
                </Button>
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} lg={4}>
          <AuthorInfoCard
            authorName={post.authorName}
            authorPhotoURL={post.authorPhotoURL}
            authorId={post.authorId}
            navigate={navigate}
          />
          <ShareButtons handleShare={handleShare} />
          <RelatedPostsList
            relatedPosts={relatedPosts}
            navigate={navigate}
            formatDate={formatDate}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default BlogDetailPage; 