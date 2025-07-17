import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const media = [
  {
    src: '/images/adana.jpg',
    title: 'Adana Şehir Merkezi',
    desc: 'Adana, Türkiye’nin en büyük altıncı şehridir ve Seyhan Nehri kıyısında yer alır. Zengin mutfağı ve tarihiyle ünlüdür.'
  },
  
];

function AdanaMediaModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Adana ile İlgili Medya</DialogTitle>
      <DialogContent dividers>
        {media.map((item, idx) => (
          <Box key={idx} sx={{ mb: 4 }}>
            <img src={item.src} alt={item.title} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>{item.title}</Typography>
            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Kapat</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdanaMediaModal; 