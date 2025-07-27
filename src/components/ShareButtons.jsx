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
        <ShareIcon sx={{ mr: 1, color: '#5A0058', fontSize: '1.2rem' }} />
        Paylaş
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
        <Tooltip title="Facebook'ta paylaş">
          <IconButton 
            size="small"
            onClick={() => handleShare('facebook')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <FacebookIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Twitter'da paylaş">
          <IconButton 
            size="small"
            onClick={() => handleShare('twitter')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <TwitterIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="LinkedIn'de paylaş">
          <IconButton 
            size="small"
            onClick={() => handleShare('linkedin')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <LinkedInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="WhatsApp'ta paylaş">
          <IconButton 
            size="small"
            onClick={() => handleShare('whatsapp')} 
            sx={{
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)'
              }
            }}
          >
            <WhatsAppIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Button
        variant="outlined"
        fullWidth
        size="small"
        onClick={() => handleShare('copy')}
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
        Linki Kopyala
      </Button>
    </CardContent>
  </Card>
);

ShareButtons.propTypes = {
  handleShare: PropTypes.func.isRequired
};

export default ShareButtons; 