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
import AdminPage from './pages/AdminPage';
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
    marginTop: 'auto',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
  };

  const fabStyle = {
    position: 'fixed',
    bottom: 24,
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
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/blog" element={<FeedPage />} />
                <Route path="/blog/:postId" element={<BlogDetailPage />} />
                <Route path="/blog/edit/:id" element={<BlogEditPage />} />
                <Route path="/school" element={<School />} />
                <Route path="/birthplace" element={<BirthPlace />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/adanamedia" element={<AdanaMediaPage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
                <Route path="/user/:userId" element={<UserProfilePage />} />
                <Route path="/myblogs" element={<MyBlogPage />} />
                <Route path="/kisiselbilgiler" element={<KisiselBilgilerPage />} />
                <Route path="/egitim" element={<EgitimPage />} />
                <Route path="/memleket" element={<MemleketPage />} />
                <Route path="/seyahatlerim" element={<SeyahatlerimPage />} />
                <Route path="/hobilerim" element={<HobilerimPage />} />
                <Route path="/dizifilm" element={<DiziFilmPage />} />
              </Routes>
            </div>
            <footer style={footerStyle}>
              © {new Date().getFullYear()} Bloggi. Tüm hakları saklıdır.
            </footer>
            <Fab color="secondary" aria-label="chat" style={fabStyle} onClick={() => setPopupOpen(true)}>
              <ChatIcon />
            </Fab>
            <MessagePopup open={popupOpen} onClose={() => setPopupOpen(false)} />
          </Router>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
