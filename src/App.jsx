import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles, Fab } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

import theme from './theme/theme';
import Header from './components/Header';
import MessagePopup from './components/MessagePopup';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import School from './pages/School';
import BirthPlace from './pages/BirthPlacePage';
import ContactPage from './pages/ContactPage';
import NotesPage from './pages/NotesPage';
import AdminPage from './pages/AdminPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogEditPage from './pages/BlogEditPage';
import AdanaMediaPage from './pages/AdanaMediaPage';
import ProfileEditPage from './pages/ProfileEditPage';
import UserProfilePage from './pages/UserProfilePage';
import MyBlogPage from './pages/MyBlogPage';
import KisiselBilgilerPage from './pages/KisiselBilgilerPage';
import EgitimPage from './pages/EgitimPage';
import MemleketPage from './pages/MemleketPage';
import SeyahatlerimPage from './pages/SeyahatlerimPage';
import HobilerimPage from './pages/HobilerimPage';
import DiziFilmPage from './pages/DiziFilmPage';
import FeedPage from './pages/FeedPage';
import './App.css';

function App() {
  const [popupOpen, setPopupOpen] = useState(false);

  const globalStyles = {
    a: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.light,
      },
    },
    body: {
      backgroundColor: theme.palette.background.default,
      margin: 0,
      fontFamily: theme.typography.fontFamily,
    }
  };

  const footerStyle = {
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
    minHeight: 60,
    textAlign: 'center',
    padding: 16,
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1300,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
  };

  const fabStyle = {
    position: 'fixed',
    bottom: 80,
    right: 24,
    zIndex: 1400
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <ErrorBoundary>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Router>
            <Header />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/okul" element={<School />} />
                <Route path="/dogumyeri" element={<BirthPlace />} />
                <Route path="/iletisim" element={<ContactPage />} />
                <Route path="/notlar" element={<NotesPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:postId" element={<BlogDetailPage />} />
                <Route path="/blog/edit" element={<BlogEditPage />} />
                <Route path="/blog/edit/:postId" element={<BlogEditPage />} />
                <Route path="/adana-medya" element={<AdanaMediaPage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
                <Route path="/user/:userId" element={<UserProfilePage />} />
                <Route path="/blogsayfam" element={<MyBlogPage />} />
                <Route path="/kisisel-bilgiler" element={<KisiselBilgilerPage />} />
                <Route path="/egitim" element={<EgitimPage />} />
                <Route path="/memleket" element={<MemleketPage />} />
                <Route path="/seyahatlerim" element={<SeyahatlerimPage />} />
                <Route path="/hobilerim" element={<HobilerimPage />} />
                <Route path="/dizi-film" element={<DiziFilmPage />} />
                <Route path="/feed" element={<FeedPage />} />
              </Routes>
            </div>
          </Router>
          <div style={footerStyle}>
            © 2025 Ceren Sinmec. Tüm hakları saklıdır.
          </div>
          <Fab 
            color="primary" 
            aria-label="mesaj" 
            onClick={() => setPopupOpen(true)} 
            style={fabStyle}
          >
            <ChatIcon />
          </Fab>
          <MessagePopup open={popupOpen} onClose={() => setPopupOpen(false)} />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
