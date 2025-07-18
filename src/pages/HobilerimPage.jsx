import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Modal,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CollectionsIcon from '@mui/icons-material/Collections';
import hobbiesData from '../constants/data/hobbies.json';

const HobilerimPage = () => {
  const [selectedHobby, setSelectedHobby] = useState(null);
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 120px)' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
        🎨 Hobilerim
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {hobbiesData.map((hobby, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              p: { xs: 2, md: 3 }
            }}>
              <CardContent sx={{ flexGrow: 1, p: { xs: 1, md: 2 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  {hobby.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  {hobby.description}
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

export default HobilerimPage; 