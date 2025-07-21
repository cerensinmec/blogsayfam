import React, { useEffect, useState } from "react";
import axios from "axios";
import BirthPlace from "../constants/data/birthPlace.json";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Container, Typography, Box, Paper, Button, Alert } from '@mui/material';

function BirthPlacePage() {
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://countriesnow.space/api/v0.1/countries/population/cities", {
        city: "adana",
      })
      .then((response) => {
        setCityInfo(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("API'den şehir verisi alınamadı:", error);
        setError("Şehir bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin..");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
        <LoadingSpinner message="Şehir bilgileri yükleniyor..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
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

  if (!cityInfo || !cityInfo.data) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Şehir bilgisi bulunamadı.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          Doğum Yerim
        </Typography>
        {/* Şehir bilgileri varsa göster */}
        {cityInfo && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Şehir: Adana</Typography>
            {/* Diğer şehir bilgileri buraya eklenebilir */}
          </Box>
        )}
        {/* Türkiye haritası kaldırıldı */}
      </Paper>
    </Container>
  );
}

export default BirthPlacePage;
