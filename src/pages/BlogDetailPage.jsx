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
import { doc, getDoc, deleteDoc, collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthorInfoCard from '../components/AuthorInfoCard';
import ShareButtons from '../components/ShareButtons';
import RelatedPostsList from '../components/RelatedPostsList';

function BlogDetailPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
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

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Firestore doc referansı:', postId);
      const postRef = doc(db, 'blog-posts', postId);
      const postSnap = await getDoc(postRef);
      const querySnapshot = await getDocs(collection(db, "blog-posts"));
console.log('querySnapshot',querySnapshot);
 
      console.log('postSnap ','postId',postSnap,postId);
      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() };
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
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
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
                  {post.likeCount > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FavoriteIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {post.likeCount} beğeni
                      </Typography>
                    </Box>
                  )}
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
            </CardContent>
          </Card>
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