import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';

const AuthorInfoCard = ({ authorName, authorPhotoURL, authorId, navigate }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Yazar Hakkında
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={authorPhotoURL} sx={{ width: 60, height: 60, mr: 2 }}>
          {authorName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6">{authorName}</Typography>
          <Typography variant="body2" color="text.secondary">
            Blog Yazarı
          </Typography>
        </Box>
      </Box>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => navigate(`/user/${authorId}`)}
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