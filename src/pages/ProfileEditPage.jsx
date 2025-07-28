import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import ImageUpload from '../components/ImageUpload';

function ProfileEditPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    school: '',
    birthPlace: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await fetchProfile(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async (uid) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ ...profile, ...docSnap.data() });
      } else {
        setProfile({
          displayName: user?.displayName || '',
          bio: '',
          school: '',
          birthPlace: '',
          photoURL: user?.photoURL || ''
        });
      }
    } catch (e) {
      setError('Profil yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profile, { merge: true });
      navigate(`/user/${user.uid}`);
    } catch (e) {
      setError('Profil kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Lütfen mevcut ve yeni şifrenizi girin.');
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordSuccess('Şifreniz başarıyla değiştirildi.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError('Şifre değiştirilirken hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
        <Alert severity="warning">Giriş yapmalısınız.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, pb: { xs: 6, md: 8 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        Profilini Düzenle
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ImageUpload
            currentImageUrl={profile.photoURL}
            onImageUpload={(url) => setProfile({ ...profile, photoURL: url })}
            onImageDelete={() => setProfile({ ...profile, photoURL: '' })}
            size="large"
            showPreview={true}
          />
        </Box>
        <TextField
          label="Ad Soyad"
          name="displayName"
          value={profile.displayName}
          onChange={handleChange}
          fullWidth
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        />
        <TextField
          label="Biyografi"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        />
        <TextField
          label="Okul"
          name="school"
          value={profile.school}
          onChange={handleChange}
          fullWidth
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        />
        <TextField
          label="Doğum Yeri"
          name="birthPlace"
          value={profile.birthPlace}
          onChange={handleChange}
          fullWidth
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
          Profil fotoğrafınızı yukarıdaki butonlarla yükleyebilir veya kamera ile çekebilirsiniz
        </Typography>
        <TextField
          label="E-posta"
          name="email"
          value={user.email}
          disabled
          fullWidth
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={saving}
          sx={{ 
            fontSize: { xs: '0.875rem', md: '1rem' },
            py: { xs: 1, md: 1.5 }
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Box>
      {/* Şifre değiştirme bölümü */}
      <Box component="form" onSubmit={handlePasswordChange} sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Şifre Değiştir</Typography>
        {passwordError && <Alert severity="error">{passwordError}</Alert>}
        {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}
        <TextField
          label="Mevcut Şifre"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Yeni Şifre"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="outlined">Şifreyi Değiştir</Button>
      </Box>
    </Container>
  );
}

export default ProfileEditPage; 