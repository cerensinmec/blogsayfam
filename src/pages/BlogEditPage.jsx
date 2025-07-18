import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Preview as PreviewIcon, Add as AddIcon } from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';

function BlogEditPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isNewPost, setIsNewPost] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'genel'
  });
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    } else {
      // Yeni blog yazısı oluşturma modu
      setIsNewPost(true);
      setLoading(false);
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postRef = doc(db, 'blog-posts', postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() };
        setPost(postData);
        setFormData({
          title: postData.title,
          content: postData.content,
          category: postData.category || 'genel'
        });
        setIsNewPost(false);
      } else {
        setError('Blog yazısı bulunamadı.');
      }
    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error);
      setError('Blog yazısı yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Başlık ve içerik alanları zorunludur.');
      return;
    }

    if (!user) {
      setError('Giriş yapmanız gerekiyor.');
      return;
    }

    // Düzenleme modunda yetki kontrolü
    if (!isNewPost && user.uid !== post?.authorId && user.email !== 'admin@example.com') {
      setError('Bu blog yazısını düzenleme yetkiniz yok.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (isNewPost) {
        // Yeni blog yazısı oluştur
        const newPostData = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          authorId: user.uid,
          authorName: user.displayName || user.email,
          authorEmail: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          views: 0,
          likes: 0
        };

        const docRef = await addDoc(collection(db, 'blog-posts'), newPostData);
        navigate(`/blog/${docRef.id}`);
      } else {
        // Mevcut blog yazısını güncelle
        const updateData = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          updatedAt: serverTimestamp()
        };

        await updateDoc(doc(db, 'blog-posts', postId), updateData);
        navigate(`/blog/${postId}`);
      }
    } catch (error) {
      console.error('Blog yazısı kaydedilirken hata:', error);
      setError('Blog yazısı kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (newContent) => {
    setFormData({ ...formData, content: newContent });
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !isNewPost && !post) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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

  if (!isNewPost && (!user || (user.uid !== post?.authorId && user.email !== 'admin@example.com'))) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Bu blog yazısını düzenleme yetkiniz yok.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/blog/${postId}`)}
        >
          Blog Yazısına Dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, pb: { xs: 6, md: 8 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          Anasayfa
        </Link>
        <Link component={RouterLink} to="/blog" color="inherit" underline="hover">
          Blog
        </Link>
        {isNewPost ? (
          <Typography color="text.primary">Yeni Blog Yazısı</Typography>
        ) : (
          <>
            <Link component={RouterLink} to={`/blog/${postId}`} color="inherit" underline="hover">
              {post?.title}
            </Link>
            <Typography color="text.primary">Düzenle</Typography>
          </>
        )}
      </Breadcrumbs>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNewPost ? 'Yeni Blog Yazısı Oluştur' : 'Blog Yazısını Düzenle'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Başlık"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 3 }}
            required
            placeholder="Blog yazınızın başlığını girin..."
          />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={formData.category}
              label="Kategori"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="genel">Genel</MenuItem>
              <MenuItem value="teknoloji">Teknoloji</MenuItem>
              <MenuItem value="yaşam">Yaşam</MenuItem>
              <MenuItem value="eğitim">Eğitim</MenuItem>
              <MenuItem value="seyahat">Seyahat</MenuItem>
              <MenuItem value="yemek">Yemek</MenuItem>
              <MenuItem value="kişisel">Kişisel</MenuItem>
              <MenuItem value="diğer">Diğer</MenuItem>
            </Select>
          </FormControl>

          {/* İçerik Editörü */}
          <TextField
            label="İçerik"
            fullWidth
            multiline
            rows={15}
            variant="outlined"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            sx={{ mb: 3 }}
            required
            placeholder="Blog yazınızın içeriğini buraya yazın..."
          />

          {/* Aksiyon Butonları */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/blog')}
            >
              İptal
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
            >
              Önizleme
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={isNewPost ? <AddIcon /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : (isNewPost ? 'Yayınla' : 'Kaydet')}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Önizleme Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Önizleme: {formData.title || 'Başlıksız'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              {formData.title || 'Başlıksız'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Kategori: {formData.category}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              '& h1, & h2, & h3': {
                marginTop: 2,
                marginBottom: 1
              },
              '& p': {
                marginBottom: 1,
                lineHeight: 1.6
              },
              '& ul, & ol': {
                marginLeft: 2
              },
              '& blockquote': {
                borderLeft: '4px solid #ccc',
                margin: '1em 0',
                paddingLeft: '1em',
                fontStyle: 'italic'
              },
              '& code': {
                backgroundColor: '#f5f5f5',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                margin: '1em 0'
              }
            }}
          >
            {formData.content.split('\n').map((line, index) => (
              <Typography key={index} paragraph>
                {line}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BlogEditPage; 