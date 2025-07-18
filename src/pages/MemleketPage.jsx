import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardMedia,
  Paper,
  Grid,
  Modal
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const images = [
  {
    src: '/images/Demiryolu_Koprusu.jpeg',
    desc: 'Adana Demiryolu Koprusu, sehrin simgelerinden biridir.'
  },
  {
    src: '/images/adanamerkezcamii.jpeg',
    desc: 'Sabanci Merkez Camii, Adana\'nin en buyuk camilerindendir.'
  },
  {
    src: '/images/adanabaraj.jpeg',
    desc: 'Seyhan Baraji, Adana\'nin dogal guzelliklerinden biridir.'
  },
  {
    src: '/images/adanakarnaval.jpeg',
    desc: 'Adana Portakal Cicegi Karnavali, her yil duzenlenen renkli bir festivaldir.'
  },
  {
    src: '/images/adana-lezzet-festivali.jpeg',
    desc: 'Adana Lezzet Festivali, sehrin zengin mutfagini kutlar.'
  },
  {
    src: '/images/adanalezzet.jpeg',
    desc: 'Adana mutfagi, kebap ve daha fazlasiyla unludur.'
  },
  {
    src: '/images/bici-bici-.jpeg',
    desc: 'Bici bici, Adana\'ya ozgu serinletici bir tatlidir.'
  }
];

const MemleketPage = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const navigate = useNavigate();

  return (
    <Container maxWidth={{ xs: 'sm', md: 'lg' }} sx={{ py: { xs: 4, md: 6 }, pb: { xs: 6, md: 8 }, px: { xs: 2, md: 3 }, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blogsayfam')}
          sx={{ 
            borderColor: 'primary.main', 
            color: 'primary.main',
            fontSize: { xs: '0.875rem', md: '1rem' },
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          Geri Dön
        </Button>
        <Typography variant="h3" component="h1" sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center',
          fontSize: { xs: '1.75rem', md: '3rem' }
        }}>
          Memleketim
        </Typography>
      </Box>

      {/* Personal Introduction */}
      <Typography variant="body1" sx={{ 
        lineHeight: 1.8, 
        mb: { xs: 3, md: 4 }, 
        fontSize: { xs: '1rem', md: '1.2rem' },
        textAlign: 'left',
        color: 'text.primary'
      }}>
        Adana benim doğup büyüdüğüm çocukluğumu geçirdiğim muhteşem bir şehir. Adana'yı o kadar çok seviyorum ki 
        ömrümün geri kalanını nerede yaşamak istediğim sorulsa kesinlikle Adana derdim tabi sadece kışın...😬
      </Typography>
      <Typography variant="body1" sx={{ 
        lineHeight: 1.8, 
        mb: { xs: 3, md: 4 }, 
        fontSize: { xs: '1rem', md: '1.2rem' },
        textAlign: 'left',
        color: 'text.primary'
      }}>
        Herkesin bildiği kavurucu sıcaklar... Yasaklanan termometreler... Özellikle temmuz ve ağustos aylarında 
        gerçekten dışarıya çıkılması mümkün olmayan bir şehir. E tabi her güzelin de bir kusuru var derler.
      </Typography>
      <Typography variant="body1" sx={{ 
        lineHeight: 1.8, 
        mb: { xs: 3, md: 4 }, 
        fontSize: { xs: '1rem', md: '1.2rem' },
        textAlign: 'left',
        color: 'text.primary'
      }}>
        Her yerin yemyeşil olması insanı gerçekten büyülüyor. Sanırım bende en çok bunu seviyorum yada yemeklerini de olabilir 
        tam emin değilim.☺️☺️
      </Typography>

      {/* Media Gallery Section */}
      <Paper sx={{ p: { xs: 2, md: 4 }, mt: { xs: 3, md: 4 }, backgroundColor: 'background.paper' }}>
        <Typography variant="h5" component="h3" sx={{ 
          color: 'primary.main', 
          mb: { xs: 2, md: 3 },
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: '1.25rem', md: '1.5rem' }
        }}>
          <PhotoLibraryIcon />
          Adana'dan Görseller
        </Typography>
        
        <Grid container spacing={{ xs: 1, md: 2 }}>
          {images.map((img, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => setOpenIdx(idx)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={img.src}
                  alt={`adana-media-${idx}`}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Image Modal */}
      <Modal open={openIdx !== null} onClose={() => setOpenIdx(null)}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 3, 
          borderRadius: 2, 
          outline: 'none', 
          maxWidth: 600, 
          width: '90%' 
        }}>
          {openIdx !== null && (
            <>
              <img 
                src={images[openIdx].src} 
                alt={`adana-media-large-${openIdx}`} 
                style={{ 
                  width: '100%', 
                  maxHeight: 400, 
                  objectFit: 'contain', 
                  borderRadius: 8, 
                  marginBottom: 16 
                }} 
              />
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                {images[openIdx].desc}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={() => setOpenIdx(null)}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  Kapat
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default MemleketPage; 