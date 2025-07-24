import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, Button, Grid, CardContent, Chip, Avatar, CardActions } from '@mui/material';
import PropTypes from 'prop-types';
import BlogPostCard from './BlogPostCard';
import { db } from '../firebase/config';
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import MessagePopup from './MessagePopup';

const BlogPosts = ({ posts, loading, error, navigate, formatDate, titleColor }) => {
  const { user } = useAuth();
  const [likeStates, setLikeStates] = useState({}); // { [postId]: { likeCount, userLiked } }
  const [commentCounts, setCommentCounts] = useState({}); // { [postId]: count }
  const [saveStates, setSaveStates] = useState({}); // { [postId]: userSaved }
  const [commentModal, setCommentModal] = useState({ open: false, postId: null });
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Beğeni, yorum ve kaydet dinleyicileri
  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const unsubLikes = [];
    const unsubComments = [];
    const unsubSaves = [];
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
      // Saves - kullanıcının kaydettikleri (savedpost koleksiyonundan)
      if (user) {
        const saveRef = collection(db, 'savedpost');
        const unsubSave = onSnapshot(saveRef, (snapshot) => {
          const savedPosts = {};
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            // Sadece bu kullanıcının kaydettiği postları işaretle
            if (data.saverId === user.uid) {
              savedPosts[data.savedId] = true;
            }
          });
          setSaveStates(savedPosts);
        });
        unsubSaves.push(unsubSave);
      }
    });
    return () => {
      unsubLikes.forEach(unsub => unsub());
      unsubComments.forEach(unsub => unsub());
      unsubSaves.forEach(unsub => unsub());
    };
  }, [posts, user]);

console.log('useruseruser',user);

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

  // Kaydet işlemi (savedpost koleksiyonu)
  const handleSave = async (post) => {
    if (!user) {
      console.log('Kaydet - Kullanıcı giriş yapmamış');
      return;
    }
    
    console.log('Kaydet işlemi başlatılıyor:', {
      userId: user.uid,
      postId: post.firestoreId,
      postTitle: post.title
    });
    
    const userSaved = saveStates[post.firestoreId];
    
    try {
      if (userSaved) {
        // Kaydedilmiş kaydı bul ve sil
        console.log('Kaydet kaldırılıyor...');
        const savedRef = collection(db, 'savedpost');
        const q = query(savedRef, 
          where('saverId', '==', user.uid),
          where('savedId', '==', post.firestoreId)
        );
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'savedpost', docSnapshot.id));
        });
        console.log('Kaydet başarıyla kaldırıldı');
      } else {
        // Yeni kaydet kaydı oluştur
        console.log('Yazı kaydediliyor...');
        await addDoc(collection(db, 'savedpost'), {
          saverId: user.uid,
          savedId: post.firestoreId,
          postTitle: post.title,
          postAuthor: post.authorName,
          savedAt: new Date()
        });
        console.log('Yazı başarıyla kaydedildi');
      }
    } catch (error) {
      console.error('Kaydet işlemi hatası:', error);
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
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', color: titleColor || undefined }}>
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
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gridAutoRows: '400px',
            gap: 3, 
            width: '100%', 
            maxWidth: 1400 
          }}>
            {posts.map((post) => (
              <Box key={post.firestoreId || post.id} sx={{ width: '100%', height: '100%' }}>
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
                  userSaved={saveStates[post.firestoreId] || false}
                  onSave={() => handleSave(post)}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </Box>
            ))}
          </Box>
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