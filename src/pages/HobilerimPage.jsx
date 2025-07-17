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
    <Container maxWidth="xl" sx={{ py: 4, pb: 8, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blogsayfam')}
          sx={{ 
            borderColor: 'primary.main', 
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          Geri Dön
        </Button>
        <Typography variant="h3" component="h1" sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center'
        }}>
          Hobilerim
        </Typography>
      </Box>

      {/* Introduction */}
      <Typography variant="body1" sx={{ 
        lineHeight: 1.8, 
        mb: 4, 
        fontSize: '1.2rem',
        textAlign: 'left',
        color: 'text.primary'
      }}>
        Herkesin boş zamanlarda yaptığı en az bir hobisi vardır, tabi benim boş zamanım biraz fazla olduğundan 🤭 hobilerim de bi hayli çok. 
        Öncelikle ilk olarak tabikiii müzik dinlemek 🎧 Bu klasikleşmiş çok da bir açıklama yapmaya bence de gerek bile yok 😃😃 
        Şarkı söylemek sesim kötü olsa bile... Hangimiz söylemiyoruz ki 🙃 
        Kitap okumak çocukluğumun en büyük hobilerindendi keşke hep öyle kalsaydı ama ne yazık ki bu alışkanlığı YKS sınavına hazırlanırken bıraktım. Umarım bu hobiyi kısa zamanda tekrar elde edebilirim. 
        Sporla çok da alakam olmamasına rağmen yüzmeye bayılıyoruuuuum 🏊‍♀️ 
        Ve evet herkeste olan hobileri geçtikten sonra sıra ilginç olanlarda. 
        İnanılmaz bir koleksiyon yapma bağımlılığım var ne yazık ki mini oyuncakları, mini parfümleri, mini arabaları koleksiyonluyorum. Aynı zamanda bir ruj koleksiyonum ve oje koleksiyonum da mevcut. Sayılarına gelecek olursak ise mini oyuncak koleksiyonum 48, mini parfüm koleksiyonum 22, mini araba koleksiyonum 51, ruj koleksiyonum 74, son olarak da oje koleksiyonum 153 parçadan oluşuyor ve hayır evim dağınık değil 😠😂 
        Diğer bir ilginç hobim ise mikrodoğa gözlemlemek. Daha önce kimsede duymadığım bir şey olsa da benim inanılmaz keyif aldığım bir olay. Bazen bir ağaç kabuğunu, bazen bir deniz kabuğunu, bazen bir bulutu birkaç saat boyunca seyrediyorum. Doğru biraz garip 😳
      </Typography>

      {/* Hobbies Grid */}
      <Grid container spacing={3}>
        {hobbiesData.map((hobby) => (
          <Grid item xs={12} sm={6} md={4} key={hobby.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => setSelectedHobby(hobby)}
            >
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3
              }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: '4rem',
                    mb: 2
                  }}
                >
                  {hobby.emoji}
                </Typography>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 2
                  }}
                >
                  {hobby.name}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    flexGrow: 1,
                    lineHeight: 1.6
                  }}
                >
                  {hobby.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Hobby Detail Modal */}
      <Modal 
        open={selectedHobby !== null} 
        onClose={() => setSelectedHobby(null)}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper sx={{ 
          maxWidth: 800, 
          width: '100%', 
          maxHeight: '90vh',
          overflow: 'auto',
          p: 4,
          position: 'relative'
        }}>
          {selectedHobby && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: '3rem'
                  }}
                >
                  {selectedHobby.emoji}
                </Typography>
                <Typography variant="h4" component="h2" sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold'
                }}>
                  {selectedHobby.name}
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Hakkında
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                {selectedHobby.description}
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Benim Deneyimlerim
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                {selectedHobby.experience}
              </Typography>

              {/* Collections Section */}
              {selectedHobby.collections && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CollectionsIcon />
                    Koleksiyonlarım
                  </Typography>
                  <List sx={{ mb: 4 }}>
                    {selectedHobby.collections.map((collection, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText 
                          primary={collection.name}
                          secondary={`${collection.count} parça`}
                        />
                        <Chip 
                          label={collection.count} 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={() => setSelectedHobby(null)}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  Kapat
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Modal>
    </Container>
  );
};

export default HobilerimPage; 