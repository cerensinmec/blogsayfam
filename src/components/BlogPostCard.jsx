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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PropTypes from 'prop-types';

const BlogPostCard = ({ post, onEdit, onDelete, formatDate, getCategoryColor, user, navigate, likeCount, userLiked, onLike, onCommentClick, commentCount }) => (
  <Card 
    sx={{ 
      minHeight: 340,
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minWidth: 500,
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
    <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Chip
          label={post.category || 'Genel'}
          color={getCategoryColor(post.category || 'Genel')}
          size="small"
          sx={{ 
            fontSize: { xs: '0.7rem', md: '0.75rem' },
            fontWeight: 500,
            borderRadius: 1
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
          {formatDate(post.createdAt) || ''}
        </Typography>
      </Box>
      
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          lineHeight: 1.3,
          mb: 2,
          color: '#8D6E63',
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}
      >
        {post.title || ''}
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
          overflow: 'hidden',
          fontSize: { xs: '0.875rem', md: '0.875rem' }
        }}
      >
        {post.content ? (post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content) : ''}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar 
          src={post.authorPhotoURL || ''} 
          sx={{ 
            width: 28, 
            height: 28,
            fontSize: '0.875rem',
            bgcolor: '#8D6E63'
          }}
        >
          {post.authorName?.charAt(0) || '?'}
        </Avatar>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {post.authorName || 'Bilinmeyen Yazar'}
        </Typography>
      </Box>
      {/* Beğeni satırının hemen yanında, küçük ve sade bir satırda yorum (💬 ikon ve yorum sayısı) alanı ekle */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
        <Box
          onClick={onCommentClick}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.1s',
            '&:active': { transform: 'scale(1.1)' }
          }}
        >
          <span style={{ fontSize: 20, color: '#8D6E63', marginRight: 4 }}>💬</span>
          <Typography variant="body2" sx={{ color: '#8D6E63', fontWeight: 600 }}>
            {commentCount}
          </Typography>
        </Box>
        <Box
          onClick={user ? onLike : undefined}
          sx={{
            cursor: user ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.1s',
            '&:active': { transform: user ? 'scale(1.2)' : 'none' }
          }}
        >
          {userLiked ? (
            <FavoriteIcon sx={{ color: '#e53935', fontSize: 24 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#bdbdbd', fontSize: 24 }} />
          )}
          <Typography variant="body2" sx={{ ml: 0.5, color: userLiked ? '#e53935' : '#757575', fontWeight: 600 }}>
            {likeCount}
          </Typography>
        </Box>
      </Box>
    </CardContent>
    
    <CardActions sx={{ p: { xs: 1.5, md: 2 }, pt: 0 }}>
      <Button 
        size="small" 
        onClick={() => navigate(`/blog/${post.id}`)}
        startIcon={<ReadMoreIcon />}
        sx={{ 
          color: '#8D6E63',
          fontWeight: 500,
          fontSize: { xs: '0.75rem', md: '0.875rem' },
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
  navigate: PropTypes.func.isRequired,
  likeCount: PropTypes.number,
  userLiked: PropTypes.bool,
  onLike: PropTypes.func,
  onCommentClick: PropTypes.func,
  commentCount: PropTypes.number
};

export default BlogPostCard; 