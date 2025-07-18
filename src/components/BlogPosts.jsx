import React from 'react';
import { Box, Typography, CircularProgress, Card, Button, Grid, CardContent, Chip, Avatar, CardActions } from '@mui/material';
import PropTypes from 'prop-types';

const BlogPosts = ({ posts, loading, error, navigate, formatDate }) => (
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, pr: { xs: 0, md: 4 }, pl: { xs: 0, md: 4 }, pt: 4 }}>
    <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
      Blog Yazıları
    </Typography>
    {loading ? (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    ) : posts.length === 0 ? (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Henüz blog yazısı bulunmuyor
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/blog')}
        >
          İlk Yazıyı Ekle
        </Button>
      </Card>
    ) : (
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, md: 6 }} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Chip 
                  label={post.category || 'Genel'} 
                  size="small" 
                  sx={{ mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.content.length > 100 
                    ? `${post.content.substring(0, 100)}...` 
                    : post.content}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar 
                    src={post.authorPhotoURL} 
                    sx={{ width: 24, height: 24 }}
                  >
                    {post.authorName?.charAt(0)}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {post.authorName}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(post.createdAt)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/blog/${post.firestoreId}`)}
                >
                  Devamını Oku
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

BlogPosts.propTypes = {
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  navigate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default BlogPosts; 