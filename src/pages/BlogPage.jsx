import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { auth, db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import BlogPostDialog from '../components/BlogPostDialog';
import BlogPostCard from '../components/BlogPostCard';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'genel'
  });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, 'blog-posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = [];
      querySnapshot.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        postsData.push(postData);
      });
      setPosts(postsData);
      setFilteredPosts(postsData);
    } catch (error) {
      setError('Blog yazıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', category: 'genel' });
    setDialogOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category || 'genel'
    });
    setDialogOpen(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'blog-posts', postId));
        await fetchPosts();
      } catch (error) {
        setError('Blog yazısı silinirken bir hata oluştu.');
      }
    }
  };

  const handleDialogSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Başlık ve içerik alanları zorunludur.');
      return;
    }
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorPhotoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      if (editingPost) {
        await updateDoc(doc(db, 'blog-posts', editingPost.id), {
          ...postData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'blog-posts'), postData);
      }
      setDialogOpen(false);
      setFormData({ title: '', content: '', category: 'genel' });
      setEditingPost(null);
      setError('');
      await fetchPosts();
    } catch (error) {
      setError('Blog yazısı kaydedilirken bir hata oluştu.');
    }
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('tr-TR', {
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
      diğer: 'default'
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Blog yazılarında ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedCategory}
                label="Kategori"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Tüm Kategoriler</MenuItem>
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
          </Grid>
        </Grid>
      </Box>
      {user && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPost}
            size="large"
          >
            Yeni Blog Yazısı
          </Button>
        </Box>
      )}
      {filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {posts.length === 0 ? 'Henüz blog yazısı bulunmuyor.' : 'Arama kriterlerinize uygun blog yazısı bulunamadı.'}
          </Typography>
          {user && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddPost}
              sx={{ mt: 2 }}
            >
              İlk Yazıyı Ekle
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPosts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <BlogPostCard
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                formatDate={formatDate}
                getCategoryColor={getCategoryColor}
                user={user}
                navigate={navigate}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <BlogPostDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        formData={formData}
        setFormData={setFormData}
        editingPost={editingPost}
        error={error}
      />
      {user && (
        <Fab
          color="primary"
          aria-label="yeni blog yazısı"
          onClick={handleAddPost}
          sx={{ position: 'fixed', bottom: 80, right: 24, zIndex: 1400 }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
}

export default BlogPage; 