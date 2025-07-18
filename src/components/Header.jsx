import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';
import AuthForm from './AuthForm';

function Header() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

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
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ background: 'primary.main', color: 'primary.contrastText', boxShadow: 2 }}>
        <Toolbar>
          {/* Sarı yıldız emojisi */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, fontSize: 36 }}>
            <span role="img" aria-label="star">⭐️</span>
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2, color: 'primary.contrastText' }}>
            Bloggi
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button component={Link} to="/" color="inherit">Anasayfa</Button>
            <Button component={Link} to="/notlar" color="inherit">Notlar</Button>
            <Button component={Link} to="/feed" color="inherit">Akış</Button>
            <Button component={Link} to="/blog" color="inherit">Blog</Button>
            
            {user ? (
              <>
                <Button component={Link} to="/profile/edit" color="inherit">Profilim</Button>
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
                  <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                    Admin Paneli
                  </MenuItem>
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
        </Toolbar>
      </AppBar>
      
      <AuthForm 
        open={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Header;
