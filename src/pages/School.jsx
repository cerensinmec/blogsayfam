import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Container, Typography, Box, Paper, Button } from '@mui/material';

function School() {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const schoolName = 'Medeniyet_Üniversitesi';
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://tr.wikipedia.org/api/rest_v1/page/summary/${schoolName}`)
      .then((response) => {
        const data = response.data;
        setSchool({
          name: data.title,
          description: data.extract,
          image: data.thumbnail?.source || '',
          link:
            data.content_urls?.desktop.page ||
            `https://tr.wikipedia.org/wiki/${schoolName}`,
        });
        setError(null);
      })
      .catch((error) => {
        console.error('Okul bilgisi alınamadı:', error);
        setError('Okul bilgisi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        <LoadingSpinner message="Okul bilgileri yükleniyor..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Hata
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Tekrar Dene
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!school) {
    return (
      <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Okul bilgisi bulunamadı.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          {school.name}
        </Typography>
        
        {school.image && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img
              src={school.image}
              alt={school.name}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        )}
        
        <Typography variant="body1" paragraph sx={{ 
          lineHeight: 1.6, 
          fontSize: { xs: '0.875rem', md: '1rem' } 
        }}>
          {school.description}
        </Typography>
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="contained"
            href={school.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1, sm: 0 },
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Daha Fazla Bilgi
          </Button>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          gap: { xs: 2, sm: 0 },
          mt: 4 
        }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/bilgiler')}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Önceki Sayfa
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dogumyeri')}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Sonraki Sayfa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default School;
