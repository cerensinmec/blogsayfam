import React, { useState } from 'react';
import { Container, Typography, Grid, Button, Box, Modal, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const diziFilmList = [
  { name: 'Stranger Things', description: '80’ler havasında, gizemli ve sürükleyici bir Netflix dizisi.', image: '' },
  { name: 'Dark', description: 'Almanya yapımı, zaman yolculuğu ve aile sırlarıyla dolu bir dizi.', image: '' },
  { name: 'Inception', description: 'Rüya içinde rüya konseptiyle akılları karıştıran bir film.', image: '' },
  { name: 'Shutter Island', description: 'Psikolojik gerilim ve sürpriz son sevenlere.', image: '' },
  { name: 'Prestij', description: 'İki sihirbazın rekabeti ve şaşırtıcı sonu.', image: '' },
  { name: 'Girl Interrupted', description: 'Akıl hastanesinde geçen, etkileyici bir film.', image: '' },
  { name: 'Gossip Girl', description: 'New York’un elit gençlerinin entrikalarla dolu hayatı.', image: '' },
  { name: 'Black Swan', description: 'Bale ve psikolojik gerilim bir arada.', image: '' },
  { name: 'Split', description: 'Çoklu kişilik bozukluğu ve gerilim.', image: '' },
  { name: 'Glass', description: 'Split ve Unbreakable filmlerinin devamı.', image: '' },
  { name: 'How I Met Your Mother', description: 'Efsaneleşmiş bir sitcom.', image: '' },
  { name: 'Young Sheldon', description: 'The Big Bang Theory’nin çocukluk yılları.', image: '' },
  { name: 'The Office', description: 'Ofis ortamında geçen komedi dizisi.', image: '' },
  { name: 'The Umbrella Academy', description: 'Süper güçlere sahip kardeşlerin maceraları.', image: '' },
  { name: 'Dr Who', description: 'Zaman yolculuğu ve bilim kurgu klasiği.', image: '' },
  { name: 'Malefiz', description: 'Kötü karakterin gözünden bir masal.', image: '' },
  { name: 'Coco', description: 'Aile, müzik ve renkli animasyon.', image: '' },
];

const introText = `Dizi ve film izlemek bana göre gerçekten bir kültür. Peki senin için ne ifade ediyor? Önüne gelen her şeyi izleyenlerden misin yada gerçekten seçici misin? Seninle gerçekten izlerken çok keyif aldığım dizi ve filmleri paylaşmak istiyorum eğer sende izleyecek bir şeyler arıyorsan belki yardımcı olur. Hadi biraz inceleyelim🤩`;

const DiziFilmPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        🎬 Dizi & Film Sayfası
      </Typography>
      
      <Box sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: { xs: 2, md: 4 }, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        boxShadow: 2 
      }}>
        <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
          Bu sayfa henüz geliştirme aşamasında. Yakında favori dizilerinizi ve filmlerinizi paylaşabileceksiniz!
        </Typography>
        
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
      </Box>
    </Container>
  );
};

export default DiziFilmPage; 