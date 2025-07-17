import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Box,
  Button,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import schoolsData from '../constants/data/schools.json';

const EgitimPage = () => {
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
          Eğitim Geçmişim
        </Typography>
      </Box>

      {/* Schools Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {schoolsData.map((school, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={school.image}
                alt={school.name}
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
                    fontSize: '1rem'
                  }}
                >
                  {school.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    flexGrow: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {school.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {school.period}
                  </Typography>
                  {school.link !== '#' && (
                    <Button
                      variant="contained"
                      size="small"
                      href={school.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        backgroundColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      }}
                    >
                      Ziyaret Et
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Info */}
      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h5" component="h3" sx={{ 
          color: 'primary.main', 
          mb: 2,
          fontWeight: 'bold'
        }}>
          Eğitim Felsefem
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Eğitim hayatım boyunca farklı okul türlerinde öğrenim gördüm. Her bir okul, 
          farklı beceriler ve deneyimler kazanmamı sağladı. İlköğretimden üniversiteye 
          kadar olan yolculuğumda, sürekli öğrenme ve gelişim odaklı bir yaklaşım benimsedim. 
          Özellikle fen lisesi deneyimim, bilimsel düşünme ve analitik becerilerimi 
          geliştirmemde büyük rol oynadı. Şu anda üniversite eğitimimle birlikte, 
          hem akademik hem de kişisel gelişimimi sürdürmeye devam ediyorum.
        </Typography>
      </Paper>
    </Container>
  );
};

export default EgitimPage; 