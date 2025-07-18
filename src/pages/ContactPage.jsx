
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          İletişim Bilgileri
        </Typography>

        {contactInfo.map((item, index) => (
          <InfoRow key={index} label={item.label} value={item.value} />
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dogumyeri')}
          >
            Önceki Sayfa
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Sonraki Sayfa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ContactPage;
