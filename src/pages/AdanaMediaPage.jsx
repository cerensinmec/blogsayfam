import React, { useState } from 'react';
import { Box, Typography, Button, Modal, Container, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const images = [
  {
    src: '/images/Demiryolu_Koprusu.jpeg',
    desc: 'Adana Demiryolu Köprüsü, şehrin simgelerinden biridir.'
  },
  {
    src: '/images/adanamerkezcamii.jpeg',
    desc: 'Sabancı Merkez Camii, Adana’nın en büyük camilerindendir.'
  },
  {
    src: '/images/adanabaraj.jpeg',
    desc: 'Seyhan Barajı, Adana’nın doğal güzelliklerinden biridir.'
  },
  {
    src: '/images/adanakarnaval.jpeg',
    desc: 'Adana Portakal Çiçeği Karnavalı, her yıl düzenlenen renkli bir festivaldir.'
  },
  {
    src: '/images/adana-lezzet-festivali.jpeg',
    desc: 'Adana Lezzet Festivali, şehrin zengin mutfağını kutlar.'
  },
  {
    src: '/images/adanalezzet.jpeg',
    desc: 'Adana mutfağı, kebap ve daha fazlasıyla ünlüdür.'
  },
  {
    src: '/images/bici-bici-.jpeg',
    desc: 'Bici bici, Adana’ya özgü serinletici bir tatlıdır.'
  }
];

function AdanaMediaPage() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <Container maxWidth={{ xs: 'sm', md: 'lg' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        📸 Adana Medya Galerisi
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {images.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              p: { xs: 2, md: 3 }
            }}>
              <CardContent sx={{ flexGrow: 1, p: { xs: 1, md: 2 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  {item.desc}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center', 
        gap: { xs: 2, sm: 3 },
        mt: 4 
      }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/blogsayfam')}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Blog Sayfama Dön
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Ana Sayfa
        </Button>
      </Box>
    </Container>
  );
}

export default AdanaMediaPage; 