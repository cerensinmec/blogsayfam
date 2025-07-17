import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import ActiveAuthors from '../components/ActiveAuthors';
import BlogPosts from '../components/BlogPosts';

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
      alignItems: 'flex-start',
      width: '100vw',
      maxWidth: '100vw',
      minHeight: '100vh',
      gap: 0,
      px: 0,
      py: 0,
    }}>
      <ActiveAuthors users={users} loading={loading} error={error} handleUserClick={handleUserClick} />
      <BlogPosts posts={posts} loading={loading} error={error} navigate={navigate} formatDate={formatDate} />
    </Container>
  );
};

export default FeedPage; 