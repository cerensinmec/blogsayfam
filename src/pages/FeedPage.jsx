import React, { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import ActiveAuthors from '../components/ActiveAuthors';
import BlogPosts from '../components/BlogPosts';
import BlogSidebar from '../components/BlogSidebar';

const FeedPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        const postsRef = collection(db, 'blog-posts');
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'), limit(6));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
        setPosts(postsData);
        // Post id'lerini logla
        console.log('FeedPage - Post firestoreId ve id alanları:', postsData.map(p => ({ firestoreId: p.firestoreId, id: p.id })));
      } catch (e) {
        console.error('FeedPage - Veri yükleme hatası:', e);
        setError('Veriler yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth={false} disableGutters sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'stretch',
      width: '100%',
      maxWidth: '100%',
      gap: 0,
      px: 0,
      py: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      justifyContent: 'center',
      height: '100%',
      minHeight: 0,
      margin: 0
    }}>
      {/* Sol Sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', minWidth: 320, maxWidth: 340, height: '100vh', bgcolor: '#F3EDE7', position: 'sticky', top: 0, overflowY: 'auto' }}>
        <BlogSidebar posts={posts} navigate={navigate} />
      </Box>
      {/* Orta içerik */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Mobilde üstte BlogSidebar */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
          <BlogSidebar posts={posts} navigate={navigate} />
        </Box>
        <BlogPosts posts={posts} loading={loading} error={error} navigate={navigate} formatDate={formatDate} />
      </Box>
      {/* Sağ Sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', minWidth: 320, maxWidth: 340, height: '100vh', bgcolor: '#F3EDE7', position: 'sticky', top: 0, overflowY: 'auto' }}>
        <ActiveAuthors users={users} loading={loading} error={error} handleUserClick={handleUserClick} />
      </Box>
      {/* Mobilde altta ActiveAuthors */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
        <ActiveAuthors users={users} loading={loading} error={error} handleUserClick={handleUserClick} />
      </Box>
    </Container>
  );
};

export default FeedPage; 