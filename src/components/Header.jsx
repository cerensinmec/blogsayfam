import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AuthForm from './AuthForm';

function Header({ headerColor, headerTextColor }) {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      handleMenuClose();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { text: 'Akış', path: '/feed' },
    { text: 'Mesajlar', path: '/messages' },
  ];

  const userMenuItems = user ? [
    { text: 'Profilim', path: `/user/${user.uid}` },
    { text: 'Admin Paneli', path: '/admin' },
  ] : [
    { text: 'Profilim', path: '/profile/edit' },
    { text: 'Admin Paneli', path: '/admin' },
  ];

  return (
    <>
      <AppBar position="static" sx={{ background: 'white', color: '#2c3e50', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          {/* Sarı yıldız emojisi */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, fontSize: { xs: 28, md: 36 } }}>
            <span role="img" aria-label="star">⭐️</span>
          </Box>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700, 
              letterSpacing: 2, 
              color: '#2c3e50',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                color: '#667eea'
              }
            }}
          >
            Bloggi
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Button component={Link} to="/" sx={{ color: '#2c3e50', fontWeight: 600, '&:hover': { color: '#667eea' } }}>
              Anasayfa
            </Button>
            {menuItems.map((item) => (
              <Button key={item.text} component={Link} to={item.path} sx={{ color: '#2c3e50', fontWeight: 600, '&:hover': { color: '#667eea' } }}>
                {item.text}
              </Button>
            ))}
            
            {user ? (
              <>
                {userMenuItems.map((item) => (
                  <Button key={item.text} component={Link} to={item.path} sx={{ color: '#2c3e50', fontWeight: 600, '&:hover': { color: '#667eea' } }}>
                    {item.text}
                  </Button>
                ))}
                <IconButton
                  sx={{ ml: 1, color: '#2c3e50', '&:hover': { color: '#667eea' } }}
                  onClick={handleMenuOpen}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Çıkış Yap
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                variant="outlined" 
                onClick={() => setAuthDialogOpen(true)}
                sx={{ 
                  borderColor: '#2c3e50', 
                  color: '#2c3e50',
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: '#667eea',
                    color: '#667eea'
                  } 
                }}
              >
                Giriş Yap
              </Button>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              sx={{ color: '#2c3e50', '&:hover': { color: '#667eea' } }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            Menu
          </Typography>
          <List>
            <ListItem 
              component={Link} 
              to="/"
              onClick={handleMobileMenuClose}
              sx={{ 
                color: 'text.primary', 
                textDecoration: 'none',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemText primary="Anasayfa" />
            </ListItem>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text} 
                component={Link} 
                to={item.path}
                onClick={handleMobileMenuClose}
                sx={{ 
                  color: 'text.primary', 
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            {user && (
              <>
                <Divider sx={{ my: 1 }} />
                {userMenuItems.map((item) => (
                  <ListItem 
                    key={item.text} 
                    component={Link} 
                    to={item.path}
                    onClick={handleMobileMenuClose}
                    sx={{ 
                      color: 'text.primary', 
                      textDecoration: 'none',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem 
                  onClick={handleLogout}
                  sx={{ 
                    color: 'error.main',
                    '&:hover': { bgcolor: 'error.light' }
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  <ListItemText primary="Çıkış Yap" />
                </ListItem>
              </>
            )}
            
            {!user && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem 
                  onClick={() => {
                    setAuthDialogOpen(true);
                    handleMobileMenuClose();
                  }}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.light' }
                  }}
                >
                  <ListItemText primary="Giriş Yap" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      
      <AuthForm 
        open={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Header;
