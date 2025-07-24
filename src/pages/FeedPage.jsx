import React, { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import BlogPosts from '../components/BlogPosts';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        setLoading(false);
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

  return (
    <Box sx={{
      backgroundColor: 'white',
      minHeight: '100vh',
      width: '100%',
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="xl">
        <BlogPosts posts={posts} loading={loading} error={error} navigate={navigate} formatDate={formatDate} titleColor="#2c3e50" />
      </Container>
    </Box>
  );
};

export default FeedPage; 