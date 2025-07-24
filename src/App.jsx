import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  GlobalStyles,
  Fab
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

import theme, { sageColor } from './theme/theme';
import Header from './components/Header';
import MessagePopup from './components/MessagePopup';
import ErrorBoundary from './components/ErrorBoundary';
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
import MessagesPage from './pages/MessagesPage';
import HomePage from './pages/HomePage';

import './App.css';

const deepForest = '#182D09';
const eggshell = '#FCFFF5';

const AppContent = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const location = useLocation();

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

  const isFeed = location.pathname === '/feed';
  const isHome = location.pathname === '/' || location.pathname === '/home';

  const footerStyle = {
    background: isFeed ? deepForest : theme.palette.primary.main,
    color: isFeed ? eggshell : theme.palette.background.default,
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
        {isHome ? (
          <>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
            <Fab color="primary" aria-label="chat" sx={fabStyle} onClick={() => setPopupOpen(true)}>
              <ChatIcon />
            </Fab>
            <MessagePopup open={popupOpen} onClose={() => setPopupOpen(false)} />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header
              headerColor={isFeed ? deepForest : undefined}
              headerTextColor={isFeed ? eggshell : undefined}
            />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/blog" element={<FeedPage />} />
                <Route path="/blog/:postId" element={<BlogDetailPage />} />
                <Route path="/blog/edit" element={<BlogEditPage />} />
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
                <Route path="/messages" element={<MessagesPage />} />
              </Routes>
            </div>
            <footer style={footerStyle}>
              <span>© {new Date().getFullYear()} Bloggi. Tüm hakları saklıdır.</span>
            </footer>
            <Fab color="primary" aria-label="chat" sx={fabStyle} onClick={() => setPopupOpen(true)}>
              <ChatIcon />
            </Fab>
            <MessagePopup open={popupOpen} onClose={() => setPopupOpen(false)} />
          </div>
        )}
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
