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
    <Container maxWidth={{ xs: 'sm', md: 'lg' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        📚 Eğitim Geçmişim
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {schoolsData.map((school, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              p: { xs: 2, md: 3 }
            }}>
              <CardContent sx={{ flexGrow: 1, p: { xs: 1, md: 2 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  {school.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  {school.description}
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
};

export default EgitimPage; 