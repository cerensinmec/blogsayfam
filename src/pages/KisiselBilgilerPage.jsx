import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfoRow from '../components/InfoRow';
import personalInfo from '../constants/data/personalInfo.json';

const labelMap = {
  name: 'İsim',
  surname: 'Soyisim',
  age: 'Yaş',
  gender: 'Cinsiyet',
  birthPlace: 'Doğum Yeri',
  birthDate: 'Doğum Tarihi',
  school: 'Okul',
  phone: 'Telefon',
  email: 'E-posta',
  address: 'Adres'
};

function KisiselBilgilerPage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/blogsayfam')}
          sx={{ mb: 2 }}
        >
          ← Geri Dön
        </Button>
      </Box>
      
      <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
        👤 Kişisel Bilgiler
      </Typography>
      
      <Box sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        p: 4, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        boxShadow: 2 
      }}>
        {personalInfo.map((item, index) => (
          <InfoRow key={index} label={labelMap[item.key]} value={item.value} />
        ))}
      </Box>
      
      {/* (Buton tamamen kaldırıldı) */}
    </Container>
  );
}

export default KisiselBilgilerPage; 