import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton, Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PropTypes from 'prop-types';

const ShareButtons = ({ handleShare }) => (
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
        <ShareIcon sx={{ mr: 1, color: '#5A0058' }} />
        Paylaş
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Tooltip title="Facebook'ta paylaş">
          <IconButton 
            onClick={() => handleShare('facebook')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <FacebookIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Twitter'da paylaş">
          <IconButton 
            onClick={() => handleShare('twitter')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <TwitterIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="LinkedIn'de paylaş">
          <IconButton 
            onClick={() => handleShare('linkedin')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <LinkedInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="WhatsApp'ta paylaş">
          <IconButton 
            onClick={() => handleShare('whatsapp')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => handleShare('copy')}
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
        Linki Kopyala
      </Button>
    </CardContent>
  </Card>
);

ShareButtons.propTypes = {
  handleShare: PropTypes.func.isRequired
};

export default ShareButtons; 