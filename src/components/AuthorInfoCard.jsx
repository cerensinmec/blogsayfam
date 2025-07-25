import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';

const AuthorInfoCard = ({ authorName, authorPhotoURL, authorId, navigate }) => (
  <Card sx={{ 
    mb: 3,
    bgcolor: 'white',
    border: '3px solid #5A0058',
    borderRadius: 2,
    boxShadow: '0 4px 8px rgba(90, 0, 88, 0.1)'
  }}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        color: '#5A0058', 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center'
      }}>
        <PersonIcon sx={{ mr: 1, color: '#5A0058' }} />
        Yazar Hakkında
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar 
          src={authorPhotoURL} 
          sx={{ 
            width: 60, 
            height: 60, 
            mr: 2,
            border: '2px solid #5A0058',
            bgcolor: '#5A0058'
          }}
        >
          {authorName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: '#5A0058', fontWeight: 600 }}>
            {authorName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A0058', opacity: 0.8, fontWeight: 500 }}>
            Blog Yazarı
          </Typography>
        </Box>
      </Box>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => navigate(`/user/${authorId}`)}
        sx={{
          borderColor: '#5A0058',
          color: '#5A0058',
          fontWeight: 600,
          '&:hover': {
            bgcolor: '#5A0058',
            color: 'white',
            borderColor: '#5A0058'
          }
        }}
      >
        Profili Görüntüle
      </Button>
    </CardContent>
  </Card>
);

AuthorInfoCard.propTypes = {
  authorName: PropTypes.string,
  authorPhotoURL: PropTypes.string,
  authorId: PropTypes.string,
  navigate: PropTypes.func.isRequired
};

export default AuthorInfoCard; 