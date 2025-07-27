import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';

const AuthorInfoCard = ({ authorName, authorPhotoURL, authorId, navigate }) => (
  <Card sx={{ 
    bgcolor: 'white',
    border: '3px solid #5A0058',
    borderRadius: 2,
    boxShadow: '0 4px 8px rgba(90, 0, 88, 0.1)',
    height: '100%'
  }}>
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        color: '#5A0058', 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem',
        mb: 2
      }}>
        <PersonIcon sx={{ mr: 1, color: '#5A0058', fontSize: '1.2rem' }} />
        Yazar Hakkında
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          src={authorPhotoURL} 
          sx={{ 
            width: 45, 
            height: 45, 
            mr: 2,
            border: '2px solid #5A0058',
            bgcolor: '#5A0058',
            fontSize: '0.9rem'
          }}
        >
          {authorName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ 
            color: '#5A0058', 
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            {authorName}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#5A0058', 
            opacity: 0.8, 
            fontWeight: 500,
            fontSize: '0.8rem'
          }}>
            Blog Yazarı
          </Typography>
        </Box>
      </Box>
      <Button
        variant="outlined"
        fullWidth
        size="small"
        onClick={() => navigate(`/user/${authorId}`)}
        sx={{
          borderColor: '#5A0058',
          color: '#5A0058',
          fontWeight: 600,
          fontSize: '0.8rem',
          py: 0.5,
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