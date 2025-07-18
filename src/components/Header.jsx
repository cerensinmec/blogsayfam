import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AuthForm from './AuthForm';

function Header() {
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
    { text: 'Anasayfa', path: '/' },
    { text: 'Notlar', path: '/notlar' },
    { text: 'Akış', path: '/feed' },
    { text: 'Blog', path: '/blog' },
  ];

  const userMenuItems = [
    { text: 'Profilim', path: '/profile/edit' },
    { text: 'Admin Paneli', path: '/admin' },
  ];

  return (
    <>
      <AppBar position="static" sx={{ background: 'primary.main', color: 'primary.contrastText', boxShadow: 2 }}>
        <Toolbar>
          {/* Sarı yıldız emojisi */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, fontSize: { xs: 28, md: 36 } }}>
            <span role="img" aria-label="star">⭐️</span>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700, 
              letterSpacing: 2, 
              color: 'primary.contrastText',
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Bloggi
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button key={item.text} component={Link} to={item.path} color="inherit">
                {item.text}
              </Button>
            ))}
            
            {user ? (
              <>
                {userMenuItems.map((item) => (
                  <Button key={item.text} component={Link} to={item.path} color="inherit">
                    {item.text}
                  </Button>
                ))}
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
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
                color="inherit" 
                onClick={() => setAuthDialogOpen(true)}
                sx={{ borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white' } }}
              >
                Giriş Yap
              </Button>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
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
