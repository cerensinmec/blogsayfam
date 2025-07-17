import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton, Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PropTypes from 'prop-types';

const ShareButtons = ({ handleShare }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        <ShareIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Paylaş
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Tooltip title="Facebook'ta paylaş">
          <IconButton onClick={() => handleShare('facebook')} color="primary">
            <FacebookIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Twitter'da paylaş">
          <IconButton onClick={() => handleShare('twitter')} color="info">
            <TwitterIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="LinkedIn'de paylaş">
          <IconButton onClick={() => handleShare('linkedin')} color="primary">
            <LinkedInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="WhatsApp'ta paylaş">
          <IconButton onClick={() => handleShare('whatsapp')} color="success">
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => handleShare('copy')}
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