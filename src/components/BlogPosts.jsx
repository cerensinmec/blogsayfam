import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, Button, Grid, CardContent, Chip, Avatar, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import BlogPostCard from './BlogPostCard';
import { db } from '../firebase/config';
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const BlogPosts = ({ posts, loading, error, navigate, formatDate, titleColor }) => {
  const { user } = useAuth();
  const [likeStates, setLikeStates] = useState({}); // { [postId]: { likeCount, userLiked } }
  const [commentCounts, setCommentCounts] = useState({}); // { [postId]: count }
  const [saveStates, setSaveStates] = useState({}); // { [postId]: userSaved }
  const [commentModal, setCommentModal] = useState({ open: false, postId: null });
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

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
  const handleOpenCommentModal = async (post) => {
    // Post ID'sini doğru şekilde al
    const postId = post.firestoreId || post.id;
    
    setCommentModal({ open: true, postId: postId });
    setCommentText('');
    setCommentsLoading(true);
    
    try {
      // Yorumları getir
      const commentsRef = collection(db, 'blog-posts', postId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommentsList(comments);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      setCommentsList([]);
    } finally {
      setCommentsLoading(false);
    }
  };
  // Yorum modalını kapat
  const handleCloseCommentModal = () => {
    setCommentModal({ open: false, postId: null });
    setCommentText('');
    setCommentsList([]);
  };
  // Yorum ekle
  const handleAddComment = async () => {
    if (!user || !commentText.trim() || !commentModal.postId) return;
    setCommentLoading(true);
    
    try {
      const newComment = {
        userId: user.uid,
        displayName: user.displayName || user.username || user.email,
        comment: commentText,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'blog-posts', commentModal.postId, 'comments'), newComment);
      
      // Yeni yorumu listeye ekle
      setCommentsList(prev => [...prev, { id: Date.now().toString(), ...newComment }]);
      setCommentText('');
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
    } finally {
      setCommentLoading(false);
    }
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
      <Dialog
        open={commentModal.open}
        onClose={handleCloseCommentModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#5A0058', fontWeight: 600 }}>
          Yorumlar
        </DialogTitle>
        <DialogContent>
          {/* Yorumlar listesi */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#5A0058', fontWeight: 600 }}>
              Mevcut Yorumlar ({commentsList.length})
            </Typography>
            
            {commentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} sx={{ color: '#5A0058' }} />
              </Box>
            ) : commentsList.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                Henüz yorum yok. İlk yorumu siz yapın!
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 3 }}>
                {commentsList.map((comment) => (
                  <Box key={comment.id} sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 1, 
                    bgcolor: 'rgba(90, 0, 88, 0.05)',
                    border: '1px solid rgba(90, 0, 88, 0.1)'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#5A0058', fontWeight: 600 }}>
                      {comment.displayName || 'Kullanıcı'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', mt: 0.5 }}>
                      {comment.comment}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5A0058', opacity: 0.7 }}>
                      {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleString('tr-TR') : ''}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          
          {/* Yorum ekleme formu */}
          {user ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: '#5A0058', fontWeight: 600 }}>
                Yorum Ekle
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Yorumunuz"
                fullWidth
                multiline
                rows={4}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#5A0058',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5A0058',
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#5A0058', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
              Yorum yapmak için giriş yapmalısınız.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseCommentModal}
            variant="outlined"
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
            Kapat
          </Button>
          {user && (
            <Button 
              onClick={handleAddComment}
              variant="contained"
              disabled={commentLoading || !commentText.trim()}
              sx={{ 
                bgcolor: '#5A0058',
                '&:hover': { bgcolor: '#4A0048' }
              }}
            >
              {commentLoading ? <CircularProgress size={20} /> : 'Yorum Ekle'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
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