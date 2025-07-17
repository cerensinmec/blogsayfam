import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia,
  Grid,
  Modal,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import citiesData from '../constants/data/cities.json';

const SeyahatlerimPage = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Header */}
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
          textAlign: 'center'
        }}>
          Seyahatlerim
        </Typography>
      </Box>

      {/* Introduction */}
      <Typography variant="body1" sx={{ 
        lineHeight: 1.8, 
        mb: 4, 
        fontSize: '1.2rem',
        textAlign: 'left',
        color: 'text.primary'
      }}>
        Türkiye'nin farklı şehirlerini gezme fırsatım oldu. Her şehirde farklı deneyimler yaşadım, 
        farklı kültürler tanıdım. İşte ziyaret ettiğim şehirler ve yaşadığım deneyimler...
      </Typography>

      {/* Cities Grid */}
      <Grid container spacing={3}>
        {citiesData.map((city) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={city.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => setSelectedCity(city)}
            >
              <CardMedia
                component="img"
                height="200"
                image={city.image}
                alt={city.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                  {city.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    flexGrow: 1,
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}
                >
                  {city.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* City Detail Modal */}
      <Modal 
        open={selectedCity !== null} 
        onClose={() => setSelectedCity(null)}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper sx={{ 
          maxWidth: 800, 
          width: '100%', 
          maxHeight: '90vh',
          overflow: 'auto',
          p: 4,
          position: 'relative'
        }}>
          {selectedCity && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LocationOnIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h4" component="h2" sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold'
                }}>
                  {selectedCity.name}
                </Typography>
              </Box>
              
              <img 
                src={selectedCity.image} 
                alt={selectedCity.name}
                style={{ 
                  width: '100%', 
                  maxHeight: 300, 
                  objectFit: 'cover', 
                  borderRadius: 8, 
                  marginBottom: 24 
                }} 
              />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Şehir Hakkında
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                {selectedCity.description}
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Benim Deneyimlerim
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                {selectedCity.experience}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={() => setSelectedCity(null)}
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
        </Paper>
      </Modal>
    </Container>
  );
};

export default SeyahatlerimPage; 