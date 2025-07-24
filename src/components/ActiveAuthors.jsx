import React from 'react';
import { Box, Typography, CircularProgress, Alert, Card, CardActionArea, Avatar } from '@mui/material';
import PropTypes from 'prop-types';

const ActiveAuthors = ({ users, loading, error, handleUserClick, titleColor }) => (
  <Box sx={{
    width: { xs: '100%', md: 340 },
    minWidth: 280,
    maxWidth: 380,
    p: { xs: 1, md: 2 },
    boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto',
    mb: { xs: 4, md: 0 },
    borderRadius: 0,
    justifyContent: 'flex-start',
  }}>
    <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', mt: 4, color: titleColor || undefined }}>
      Aktif Yazarlar
    </Typography>
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Box sx={{ width: '100%' }}>
        {users.map((user) => (
          <Card key={user.id} sx={{ mb: 2 }}>
            <CardActionArea
              onClick={() => handleUserClick(user.id)}
              sx={{
                transition: 'background 0.2s',
                '&:hover': { background: '#C44569' },
                '&.Mui-focusVisible': { background: '#C44569' },
                '&:active': { background: '#C44569' }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Avatar src={user.photoURL || ''} sx={{ width: 80, height: 80, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {user.displayName || user.username || ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.email || 'Kullanıcı'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {user.bio || 'Henüz biyografi eklenmemiş.'}
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    )}
  </Box>
);

ActiveAuthors.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleUserClick: PropTypes.func.isRequired,
};

export default ActiveAuthors; 