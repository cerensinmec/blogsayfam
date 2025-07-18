
import InfoRow from '../components/InfoRow';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button } from '@mui/material';

function ContactPage() {
  const contactInfo = [
    { label: 'İsim', value: 'Ceren' },
    { label: 'Soyisim', value: 'Sinmec' },
    { label: 'Telefon', value: '0552 540 86 93' },
    { label: 'E-posta', value: 'cerennsinmec@gmail.com' },
    { label: 'Adres', value: 'İstanbul, Türkiye' },
  ];
  const navigate = useNavigate();

  return (
    <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
          İletişim Bilgileri
        </Typography>

        {contactInfo.map((item, index) => (
          <InfoRow key={index} label={item.label} value={item.value} />
        ))}
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          gap: { xs: 2, sm: 0 },
          mt: 4 
        }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dogumyeri')}
            fullWidth={false}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 1, sm: 0 }
            }}
          >
            Önceki Sayfa
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Ana Sayfa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ContactPage;
