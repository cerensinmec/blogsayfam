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
    <Container maxWidth="md" sx={{ py: 4, pb: 8, minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blogsayfam')}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
              color: 'white',
            },
          }}
        >
          Geri Dön
        </Button>
        <Typography variant="h3" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          Dizi & Film Önerilerim
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4, fontSize: '1.2rem', textAlign: 'left', color: 'text.primary' }}>
        {introText}
      </Typography>
      <Grid container spacing={3}>
        {diziFilmList.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: '100%',
                height: 80,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
              onClick={() => setSelected(item)}
            >
              {item.name}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          p: 4,
          minWidth: 320,
          maxWidth: 400,
          width: '90%',
          outline: 'none',
          borderRadius: 3,
          textAlign: 'center',
        }}>
          {selected && (
            <>
              {selected.image && (
                <img src={selected.image} alt={selected.name} style={{ width: '100%', maxHeight: 200, objectFit: 'contain', marginBottom: 16, borderRadius: 8 }} />
              )}
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>{selected.name}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{selected.description}</Typography>
              <Button variant="contained" color="primary" onClick={() => setSelected(null)}>
                Kapat
              </Button>
            </>
          )}
        </Paper>
      </Modal>
    </Container>
  );
};

export default DiziFilmPage; 