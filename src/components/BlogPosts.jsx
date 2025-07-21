import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, Button, Grid, CardContent, Chip, Avatar, CardActions } from '@mui/material';
import PropTypes from 'prop-types';
import BlogPostCard from './BlogPostCard';
import { db } from '../firebase/config';
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import MessagePopup from './MessagePopup';

const BlogPosts = ({ posts, loading, error, navigate, formatDate }) => {
  const { user } = useAuth();
  const [likeStates, setLikeStates] = useState({}); // { [postId]: { likeCount, userLiked } }
  const [commentCounts, setCommentCounts] = useState({}); // { [postId]: count }
  const [commentModal, setCommentModal] = useState({ open: false, postId: null });
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Beğeni ve yorum sayısı dinleyicileri
  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const unsubLikes = [];
    const unsubComments = [];
    posts.forEach(post => {
      // Likes
      const likeRef = collection(db, 'blog-posts', post.firestoreId, 'likes');
      const unsubLike = onSnapshot(likeRef, (snapshot) => {
        setLikeStates(prev => ({
          ...prev,
          [post.firestoreId]: {
            likeCount: snapshot.size,
            userLiked: user ? snapshot.docs.some(doc => doc.id === user.uid) : false
          }
        }));
      });
      unsubLikes.push(unsubLike);
      // Comments
      const commentRef = collection(db, 'blog-posts', post.firestoreId, 'comments');
      const unsubComment = onSnapshot(commentRef, (snapshot) => {
        setCommentCounts(prev => ({ ...prev, [post.firestoreId]: snapshot.size }));
      });
      unsubComments.push(unsubComment);
    });
    return () => {
      unsubLikes.forEach(unsub => unsub());
      unsubComments.forEach(unsub => unsub());
    };
  }, [posts, user]);

  // Beğeni işlemi
  const handleLike = async (post) => {
    if (!user) return;
    const likeRef = doc(db, 'blog-posts', post.firestoreId, 'likes', user.uid);
    const userLiked = likeStates[post.firestoreId]?.userLiked;
    if (userLiked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, { likedAt: new Date() });
    }
  };

  // Yorum modalını aç
  const handleOpenCommentModal = (post) => {
    setCommentModal({ open: true, postId: post.firestoreId });
    setCommentText('');
  };
  // Yorum modalını kapat
  const handleCloseCommentModal = () => {
    setCommentModal({ open: false, postId: null });
    setCommentText('');
  };
  // Yorum ekle
  const handleAddComment = async () => {
    if (!user || !commentText.trim() || !commentModal.postId) return;
    setCommentLoading(true);
    await addDoc(collection(db, 'blog-posts', commentModal.postId, 'comments'), {
      userId: user.uid,
      displayName: user.displayName || user.username || user.email,
      comment: commentText,
      createdAt: new Date()
    });
    setCommentLoading(false);
    handleCloseCommentModal();
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, pr: { xs: 0, md: 2 }, pl: { xs: 0, md: 2 }, pt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Blog Yazıları
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Henüz blog yazısı bulunmuyor
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/blog')}
          >
            İlk Yazıyı Ekle
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 1200, width: '100%' }} alignItems="stretch">
            {posts.map((post) => (
              <Grid item xs={12} md={6} key={post.firestoreId || post.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: 500, display: 'flex' }}>
                  <BlogPostCard
                    post={post}
                    user={user}
                    navigate={navigate}
                    formatDate={formatDate}
                    getCategoryColor={() => 'primary'}
                    likeCount={likeStates[post.firestoreId]?.likeCount || 0}
                    userLiked={likeStates[post.firestoreId]?.userLiked || false}
                    onLike={() => handleLike(post)}
                    commentCount={commentCounts[post.firestoreId] || 0}
                    onCommentClick={() => handleOpenCommentModal(post)}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    sx={{ height: '100%', width: '100%' }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* Yorum ekleme modalı */}
      <MessagePopup
        open={commentModal.open}
        onClose={handleCloseCommentModal}
        title="Yorum Ekle"
        inputLabel="Yorumunuz"
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
        onSend={handleAddComment}
        loading={commentLoading}
        showSendButton
      />
    </Box>
  );
};

BlogPosts.propTypes = {
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  navigate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default BlogPosts; 