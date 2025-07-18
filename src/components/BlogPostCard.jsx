import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ReadMore as ReadMoreIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const BlogPostCard = ({ post, onEdit, onDelete, formatDate, getCategoryColor, user, navigate }) => (
  <Card 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)'
      }
    }}
  >
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Chip
          label={post.category || 'Genel'}
          color={getCategoryColor(post.category)}
          size="small"
          sx={{ 
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: 1
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {formatDate(post.createdAt)}
        </Typography>
      </Box>
      
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          lineHeight: 1.3,
          mb: 2,
          color: '#2c3e50'
        }}
      >
        {post.title}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        paragraph
        sx={{ 
          lineHeight: 1.6,
          mb: 3,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar 
          src={post.authorPhotoURL} 
          sx={{ 
            width: 28, 
            height: 28,
            fontSize: '0.875rem',
            bgcolor: '#8D6E63'
          }}
        >
          {post.authorName?.charAt(0)}
        </Avatar>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {post.authorName}
        </Typography>
      </Box>
    </CardContent>
    
    <CardActions sx={{ p: 2, pt: 0 }}>
      <Button 
        size="small" 
        onClick={() => navigate(`/blog/${post.id}`)}
        startIcon={<ReadMoreIcon />}
        sx={{ 
          color: '#8D6E63',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'rgba(141, 110, 99, 0.08)'
          }
        }}
      >
        Devamını Oku
      </Button>
      
      {user && user.uid === post.authorId && (
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            startIcon={<EditIcon />} 
            onClick={() => onEdit(post)}
            sx={{ 
              color: '#2196f3',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.08)'
              }
            }}
          >
            Düzenle
          </Button>
          <Button 
            size="small" 
            startIcon={<DeleteIcon />} 
            color="error" 
            onClick={() => onDelete(post.id)}
            sx={{ 
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.08)'
              }
            }}
          >
            Sil
          </Button>
        </Box>
      )}
    </CardActions>
  </Card>
);

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getCategoryColor: PropTypes.func.isRequired,
  user: PropTypes.object,
  navigate: PropTypes.func.isRequired
};

export default BlogPostCard; 