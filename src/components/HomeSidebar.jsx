import React from 'react';
import { Paper, Typography, Box, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import { TrendingUp, People, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HomeSidebar({ stats, categories, posts, loading }) {
  const navigate = useNavigate();
  return (
    <>
      {/* İstatistikler */}
      <Paper sx={{ p: 2, mb: 2, width: '100%', background: '#fff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>İSTATİSTİKLER</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 24, color: 'primary.main', mb: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.posts}</Typography>
            <Typography variant="caption" color="text.secondary">Blog</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <People sx={{ fontSize: 24, color: 'secondary.main', mb: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.users}</Typography>
            <Typography variant="caption" color="text.secondary">Yazar</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Favorite sx={{ fontSize: 24, color: 'error.main', mb: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.views}</Typography>
            <Typography variant="caption" color="text.secondary">Görüntüleme</Typography>
          </Box>
        </Box>
      </Paper>
      {/* Kategoriler */}
      <Paper sx={{ p: 2, mb: 2, width: '100%', background: '#fff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>KATEGORİLER</Typography>
        <Grid container spacing={1}>
          {categories.map((category) => (
            <Grid item xs={6} key={category.name}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 1, 
                  cursor: 'pointer',
                  background: '#f9f9f9',
                  borderRadius: 2,
                  boxShadow: '0 1px 6px 0 rgba(0,0,0,0.03)',
                  '&:hover': { background: '#f3d6ce' }
                }}
                onClick={() => navigate(category.path)}
              >
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                  {category.icon}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                  {category.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      {/* Öne Çıkan Bloglar */}
      <Paper sx={{ p: 2, width: '100%', background: '#fff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>ÖNE ÇIKAN YAZILAR</Typography>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        ) : posts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Henüz yazı yok
          </Typography>
        ) : (
          <Box>
            {posts.map((post) => (
              <Card 
                key={post.id} 
                sx={{ mb: 1.5, cursor: 'pointer', background: '#f9f9f9', borderRadius: 2, '&:hover': { background: '#f3d6ce' } }}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Chip 
                    label={post.category || 'Genel'} 
                    size="small" 
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5, color: 'primary.main' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.createdAt
                      ? (post.createdAt.toDate
                          ? new Date(post.createdAt.toDate()).toLocaleDateString('tr-TR')
                          : (typeof post.createdAt === 'string'
                              ? new Date(post.createdAt).toLocaleDateString('tr-TR')
                              : (post.createdAt instanceof Date
                                  ? post.createdAt.toLocaleDateString('tr-TR')
                                  : '')))
                      : ''}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </>
  );
}

export default HomeSidebar; 