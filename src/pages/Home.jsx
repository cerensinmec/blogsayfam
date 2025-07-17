import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Article, 
  Explore,
  TrendingUp,
  People,
  Favorite
} from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import HomeSidebar from '../components/HomeSidebar';
import '../App.css';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_NAME = 'Ceren';
const ADMIN_SURNAME = 'Sinmec';
const ADMIN_UID = undefined;
const ADMIN_EMAIL = 'cerennsinmec@gmail.com';
const PROFILE_PHOTO = 'https://randomuser.me/api/portraits/women/44.jpg';

const labelMap = {
  name: 'İsim',
  surname: 'Soyisim',
  age: 'Yaş',
  gender: 'Cinsiyet',
  birthPlace: 'Doğum Yeri',
  birthDate: 'Doğum Tarihi',
  school: 'Okul',
  phone: 'Telefon',
  email: 'E-posta',
  address: 'Adres'
};

const categories = [
  { name: 'Yaşam', icon: '🌱', color: 'success', path: '/blog?category=yaşam' },
  { name: 'Teknoloji', icon: '💻', color: 'primary', path: '/blog?category=teknoloji' },
  { name: 'Seyahat', icon: '✈️', color: 'info', path: '/blog?category=seyahat' },
  { name: 'Yemek', icon: '🍕', color: 'warning', path: '/blog?category=yemek' },
  { name: 'Eğitim', icon: '📚', color: 'secondary', path: '/blog?category=eğitim' },
  { name: 'Kişisel', icon: '💭', color: 'default', path: '/blog?category=kişisel' }
];

function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, users: 0, views: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kullanıcıları getir
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        // Blog yazılarını getir (son 3 tanesi)
        const postsRef = collection(db, 'blog-posts');
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'), limit(3));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('ÇEKİLEN POSTS:', postsData); // DEBUG LOG
        setPosts(postsData);

        // İstatistikleri hesapla
        setStats({
          posts: postsSnapshot.size,
          users: usersSnapshot.size,
          views: Math.floor(Math.random() * 1000) + 500
        });

      } catch (e) {
        console.error('Home - Veri yükleme hatası:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleBlogStart = () => {
    if (currentUser) {
      // Kullanıcı giriş yapmışsa blog yazma sayfasına yönlendir
      navigate('/blog/edit');
    } else {
      // Kullanıcı giriş yapmamışsa auth formunu aç
      setAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // Giriş başarılı olduktan sonra blog yazma sayfasına yönlendir
    navigate('/blog/edit');
  };

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8e9e6', m: 0, p: 0 }}>
      <Container maxWidth={false} disableGutters sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        py: 0,
        px: 0,
        m: 0,
        width: '100vw',
        minWidth: 0,
        maxWidth: '100vw',
        gap: 0
      }}>
        {/* Sol Blok - Sidebar */}
        <Box sx={{
          width: { xs: '100%', md: 340 },
          minWidth: 280,
          maxWidth: 380,
          background: '#f3d6ce',
          p: { xs: 1, md: 2 },
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: isMdUp ? '100vh' : 'auto',
          mb: { xs: 4, md: 0 },
          pl: 0,
          borderRadius: 0,
          justifyContent: 'flex-start',
        }}>
          <HomeSidebar stats={stats} categories={categories} posts={posts} loading={loading} />
        </Box>
        {/* Sağ Blok - İçerik */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, pr: { xs: 0, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 6, mb: 2, fontSize: 56 }}>
            <span role="img" aria-label="star" style={{ fontSize: 56, marginRight: 16 }}>⭐️</span>
            <span style={{ fontFamily: 'cursive', fontSize: '2.5rem', fontWeight: 600, color: '#4E342E' }}>Bloggi</span>
          </Box>
          <Box sx={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, color: 'text.primary', mb: 3, textAlign: 'center' }}>
            HOŞGELDİNİZ
          </Box>
          <Box sx={{ fontSize: 18, color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 3, textAlign: 'center' }}>
            Her zaman bir içerik üreticisi olmak istemiştim fakat kendimi rahat hissedebildiğim bir platform bulamamıştım ve BLOGGİ bu yüzden oluşturuldu.<br/>
            Burada aklına gelen ama söyleyip söylememekte kararsız kaldığın🤔 ve en sonunda da içine attığın😔 o düşüncelerini paylaşabilirsin. İlgi duyduğun konularda bizleri bilgilendirip bize ilham olabilirsin.🤩<br/>
            Komik bulduğun anları anlatıp hepimizin gülümsemesini sağlayabilirsin.😊 BLOGGİ hem fotoğraf hem yazı paylaşabileceğin dijital bir günlük. Bu günlüğü nasıl doldurmak istediğin tamamen sana kalmış.<br/>
            Dilersen önce benim blog sayfamı inceleyebilirsin dilersen de direkt kendi blog sayfanı yaratmaya başlayabilirsin.🙂💕
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={() => navigate('/blogsayfam')}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
                '&:active': { bgcolor: 'primary.dark' },
                '&:focus': { bgcolor: 'primary.dark' }
              }}
            >
              Blog Sayfamı Ziyaret Et
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={handleBlogStart}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
                '&:active': { bgcolor: 'primary.dark' },
                '&:focus': { bgcolor: 'primary.dark' }
              }}
            >
              Blog Yazmaya Başla
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Auth Form Dialog */}
      <AuthForm 
        open={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </Box>
  );
}

export default Home;
