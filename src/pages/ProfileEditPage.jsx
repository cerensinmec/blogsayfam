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

  if (loading) {
    return (
      <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 }, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  if (!user) {
    return (
      <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        <Alert severity="warning">Giriş yapmalısınız.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={{ xs: 'sm', md: 500 }} sx={{ py: { xs: 4, md: 6 }, pb: { xs: 8, md: 10 }, px: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        Profilini Düzenle
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar src={profile.photoURL} sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 } }} />
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
        <TextField
          label="Profil Fotoğrafı URL"
          name="photoURL"
          value={profile.photoURL}
          onChange={handleChange}
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
    </Container>
  );
}

export default ProfileEditPage; 