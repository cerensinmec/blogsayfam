import React, { useState } from 'react';
import { Container, Typography, Button, Box, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const diziFilmList = [
  { name: 'Stranger Things', description: '80’ler havasında, gizemli ve sürükleyici bir Netflix dizisi.' },
  { name: 'Dark', description: 'Almanya yapımı, zaman yolculuğu ve aile sırlarıyla dolu bir dizi.' },
  { name: 'Inception', description: 'Rüya içinde rüya konseptiyle akılları karıştıran bir film.' },
  { name: 'Shutter Island', description: 'Psikolojik gerilim ve sürpriz son sevenlere.' },
  { name: 'Prestij', description: 'İki sihirbazın rekabeti ve şaşırtıcı sonu.' },
  { name: 'Girl Interrupted', description: 'Akıl hastanesinde geçen, etkileyici bir film.' },
  { name: 'Gossip Girl', description: 'New York’un elit gençlerinin entrikalarla dolu hayatı.' },
  { name: 'Black Swan', description: 'Bale ve psikolojik gerilim bir arada.' },
  { name: 'Split', description: 'Çoklu kişilik bozukluğu ve gerilim.' },
  { name: 'Glass', description: 'Split ve Unbreakable filmlerinin devamı.' },
  { name: 'How I Met Your Mother', description: 'Efsaneleşmiş bir sitcom.' },
  { name: 'Young Sheldon', description: 'The Big Bang Theory’nin çocukluk yılları.' },
  { name: 'The Office', description: 'Ofis ortamında geçen komedi dizisi.' },
  { name: 'The Umbrella Academy', description: 'Süper güçlere sahip kardeşlerin maceraları.' },
  { name: 'Dr Who', description: 'Zaman yolculuğu ve bilim kurgu klasiği.' },
  { name: 'Malefiz', description: 'Kötü karakterin gözünden bir masal.' },
  { name: 'Coco', description: 'Aile, müzik ve renkli animasyon.' },
];

const introText = `Dizi ve film izlemek bana göre gerçekten bir kültür. Peki senin için ne ifade ediyor? Önüne gelen her şeyi izleyenlerden misin yada gerçekten seçici misin? Seninle gerçekten izlerken çok keyif aldığım dizi ve filmleri paylaşmak istiyorum eğer sende izleyecek bir şeyler arıyorsan belki yardımcı olur. Hadi biraz inceleyelim🤩`;

const DiziFilmPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' }, color: 'primary.main', fontWeight: 700, bgcolor: 'background.paper', width: '100%', py: 2, borderRadius: 2, mb: 3, boxShadow: 2 }}>
        🎬 Dizi & Film Sayfası
      </Typography>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2, mb: 4 }}>
        <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' }, color: 'text.primary', textAlign: 'center' }}>
          {introText}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          width: '100vw',
          maxWidth: '100vw',
          mx: 0,
          px: 0,
          '@media (max-width: 900px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (max-width: 600px)': {
            gridTemplateColumns: 'repeat(1, 1fr)',
          },
        }}
      >
        {diziFilmList.map((item, idx) => (
          <Box key={idx} sx={{ width: '100%', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleToggle(idx)}
              sx={{
                width: '100%',
                height: '100%',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0,
                m: 0,
                transition: 'background 0.2s',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {item.name}
            </Button>
            <Collapse in={openIndex === idx}>
              <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '1rem', color: 'text.primary', mt: 1 }}>{item.description}</Typography>
            </Collapse>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: { xs: 2, sm: 3 }, mt: 5 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/blogsayfam')}
          sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '0.875rem', md: '1rem' }, bgcolor: 'secondary.main', color: '#fff', '&:hover': { bgcolor: 'secondary.dark' } }}
        >
          Blog Sayfama Dön
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '0.875rem', md: '1rem' }, borderColor: 'secondary.main', color: 'secondary.main', '&:hover': { borderColor: 'secondary.dark', color: 'secondary.dark' } }}
        >
          Ana Sayfa
        </Button>
      </Box>
    </Container>
  );
};

export default DiziFilmPage; 