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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <LoadingSpinner message="Okul bilgileri yükleniyor..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Hata
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            Tekrar Dene
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!school) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Okul bilgisi bulunamadı.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
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
        
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          {school.description}
        </Typography>
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="contained"
            href={school.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 2 }}
          >
            Daha Fazla Bilgi
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/bilgiler')}
          >
            Önceki Sayfa
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dogumyeri')}
          >
            Sonraki Sayfa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default School;
