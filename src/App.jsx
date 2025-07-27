import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  GlobalStyles
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import theme, { sageColor } from './theme/theme';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import School from './pages/School';
import BirthPlace from './pages/BirthPlacePage';
import ContactPage from './pages/ContactPage';

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



const AppContent = () => {
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
      backgroundColor: 'white',
      margin: 0,
      fontFamily: theme.typography.fontFamily,
    }
  };

  const isFeed = location.pathname === '/feed';
  const isMessages = location.pathname === '/messages';
  const isHome = location.pathname === '/' || location.pathname === '/home';



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <ErrorBoundary>
        {isHome ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'white' }}>
            <Header />
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
