import React, { useEffect, useState } from "react";
import axios from "axios";
import BirthPlace from "../constants/data/birthPlace.json";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Container, Typography, Box, Paper, Button, Alert } from '@mui/material';
import TurkeyMap from '../components/TurkeyMap';

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
        setError("Şehir bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <LoadingSpinner message="Şehir bilgileri yükleniyor..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
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

  if (!cityInfo || !cityInfo.data) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Şehir bilgisi bulunamadı.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Doğum Yerim
        </Typography>
        {/* Şehir bilgileri varsa göster */}
        {cityInfo && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Şehir: Adana</Typography>
            {/* Diğer şehir bilgileri buraya eklenebilir */}
          </Box>
        )}
        {/* Türkiye haritası kaldırıldı */}
      </Paper>
    </Container>
  );
}

export default BirthPlacePage;
