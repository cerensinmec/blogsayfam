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
    <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/blogsayfam')}
          sx={{ 
            mb: { xs: 1, md: 2 },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          ← Geri Dön
        </Button>
      </Box>
      
      <Typography variant="h3" align="center" gutterBottom sx={{ 
        mb: { xs: 4, md: 6 },
        fontSize: { xs: '1.75rem', md: '3rem' }
      }}>
        👤 Kişisel Bilgiler
      </Typography>
      
      <Box sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        p: { xs: 2, md: 4 }, 
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