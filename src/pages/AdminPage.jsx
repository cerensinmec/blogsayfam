import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  collection, 
  query, 
  onSnapshot, 
  deleteDoc, 
  doc,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { loadSampleData, clearAllData, checkDataExists } from '../services/sampleDataService';
import { createSimpleTestData } from '../services/simpleTestData';
import { checkCurrentDataStatus } from '../services/checkDataStatus';
import { addUsersOnly } from '../services/addUsersOnly';
import { fixBlogAuthors } from '../services/fixBlogAuthors';
import { testFirebaseConnection } from '../services/testConnection';
import NoteCard from '../components/NoteCard';
import AdminBlogPostCard from '../components/AdminBlogPostCard';

function AdminPage() {
  const [allNotes, setAllNotes] = useState([]);
  const [allBlogPosts, setAllBlogPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dataStatus, setDataStatus] = useState({ hasUsers: false, hasPosts: false, userCount: 0, postCount: 0 });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const adminEmails = ['cerennsinmec@gmail.com'];

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLoadSampleData = async () => {
    setLoading(true);
    try {
      const result = await loadSampleData();
      showSnackbar(result.message, result.success ? 'success' : 'warning');
      if (result.success) {
        await checkDataStatus();
      }
    } catch (error) {
      showSnackbar('Veriler yüklenirken hata oluştu: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('Tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      setLoading(true);
      try {
        const result = await clearAllData();
        showSnackbar(result.message, result.success ? 'success' : 'error');
        if (result.success) {
          await checkDataStatus();
        }
      } catch (error) {
        showSnackbar('Veriler silinirken hata oluştu: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateTestData = async () => {
    setLoading(true);
    try {
      const result = await createSimpleTestData();
      showSnackbar(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        await checkDataStatus();
      }
    } catch (error) {
      showSnackbar('Test verisi oluşturulurken hata oluştu: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCurrentData = async () => {
    try {
      await checkCurrentDataStatus();
      showSnackbar('Veri durumu console\'da görüntülendi', 'info');
    } catch (error) {
      showSnackbar('Veri durumu kontrol edilirken hata oluştu: ' + error.message, 'error');
    }
  };

  const handleAddUsersOnly = async () => {
    setLoading(true);
    try {
      const result = await addUsersOnly();
      showSnackbar(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        await checkDataStatus();
      }
    } catch (error) {
      showSnackbar('Kullanıcılar eklenirken hata oluştu: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFixBlogAuthors = async () => {
    setLoading(true);
    try {
      const result = await fixBlogAuthors();
      showSnackbar(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showSnackbar('Blog yazıları düzeltilirken hata oluştu: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const result = await testFirebaseConnection();
      showSnackbar(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        console.log('Bağlantı testi başarılı:', result.data);
      } else {
        console.error('Bağlantı testi başarısız:', result.error);
      }
    } catch (error) {
      showSnackbar('Bağlantı testi sırasında hata oluştu: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkDataStatus = async () => {
    try {
      const status = await checkDataExists();
      setDataStatus(status);
    } catch (error) {
      console.error('Veri durumu kontrol edilirken hata:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && adminEmails.includes(user.email)) {
      checkDataStatus();
    }
  }, [user]);

  useEffect(() => {
    if (!user || !adminEmails.includes(user.email)) return;

    // Notları dinle
    const notesQuery = query(collection(db, 'notes'));
    const notesUnsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllNotes(notesData);
    });

    // Blog yazılarını dinle
    const blogQuery = query(collection(db, 'blog-posts'), orderBy('createdAt', 'desc'));
    const blogUnsubscribe = onSnapshot(blogQuery, (snapshot) => {
      const blogData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllBlogPosts(blogData);
    });

    return () => {
      notesUnsubscribe();
      blogUnsubscribe();
    };
  }, [user]);

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {}
  };

  const handleDeleteBlogPost = async (postId) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'blog-posts', postId));
      } catch (error) {}
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

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="info-container">
          <Typography variant="h4" gutterBottom>
            Admin Paneli
          </Typography>
          <Alert severity="warning">
            Bu sayfaya erişmek için giriş yapmanız gerekiyor.
          </Alert>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button className="back-button" onClick={() => navigate('/')}>Önceki Sayfa</button>
          </div>
        </div>
      </div>
    );
  }

  if (!adminEmails.includes(user.email)) {
    return (
      <div className="page-wrapper">
        <div className="info-container">
          <Typography variant="h4" gutterBottom>
            Admin Paneli
          </Typography>
          <Alert severity="error">
            Bu sayfaya erişim yetkiniz bulunmuyor.
          </Alert>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button className="back-button" onClick={() => navigate('/')}>Önceki Sayfa</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="info-container">
        <Typography variant="h4" gutterBottom>
          Admin Paneli
        </Typography>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Notlar" />
          <Tab label="Blog Yazıları" />
          <Tab label="Veri Yönetimi" />
        </Tabs>
        {activeTab === 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tüm kullanıcıların notları
            </Typography>
            {allNotes.length === 0 ? (
              <Typography color="text.secondary">
                Henüz hiç not eklenmemiş.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {allNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
                ))}
              </Box>
            )}
          </>
        )}
        {activeTab === 1 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tüm blog yazıları
            </Typography>
            {allBlogPosts.length === 0 ? (
              <Typography color="text.secondary">
                Henüz hiç blog yazısı eklenmemiş.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {allBlogPosts.map((post) => (
                  <AdminBlogPostCard
                    key={post.id}
                    post={post}
                    onView={(id) => navigate(`/blog/${id}`)}
                    onEdit={(id) => navigate(`/blog/edit/${id}`)}
                    onDelete={handleDeleteBlogPost}
                    formatDate={formatDate}
                  />
                ))}
              </Box>
            )}
          </>
        )}
        {activeTab === 2 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Veri yönetimi ve örnek veriler
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadSampleData}
                disabled={loading || (dataStatus.hasUsers && dataStatus.hasPosts)}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Yükleniyor...' : 'Örnek Verileri Yükle'}
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCreateTestData}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Oluşturuluyor...' : 'Test Verisi Oluştur'}
              </Button>
              
              <Button
                variant="outlined"
                color="info"
                onClick={handleCheckCurrentData}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                Mevcut Verileri Kontrol Et
              </Button>
              
              <Button
                variant="outlined"
                color="warning"
                onClick={handleAddUsersOnly}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                Sadece Kullanıcıları Ekle
              </Button>
              
              <Button
                variant="outlined"
                color="success"
                onClick={handleFixBlogAuthors}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                Blog Yazar ID'lerini Düzelt
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={handleTestConnection}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                Firebase Bağlantısını Test Et
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearAllData}
                disabled={loading || (!dataStatus.hasUsers && !dataStatus.hasPosts)}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Siliniyor...' : 'Tüm Verileri Sil'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              <strong>Örnek veriler şunları içerir:</strong>
              <br />• 5 farklı kullanıcı profili
              <br />• 8 blog yazısı (teknoloji, yemek, seyahat, eğitim, yaşam kategorilerinde)
              <br />• Beğeniler ve yorumlar
              <br />• Gerçekçi profil bilgileri ve fotoğraflar
            </Typography>
          </>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminPage; 