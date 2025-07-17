import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const BlogPostCard = ({ post, onEdit, onDelete, formatDate, getCategoryColor, user, navigate }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Chip
        label={post.category || 'Genel'}
        color={getCategoryColor(post.category)}
        size="small"
        sx={{ mb: 2 }}
      />
      <Typography variant="h6" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Avatar src={post.authorPhotoURL} sx={{ width: 24, height: 24 }}>
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
      <Button size="small" onClick={() => navigate(`/blog/${post.id}`)}>
        Devamını Oku
      </Button>
      {user && user.uid === post.authorId && (
        <>
          <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(post)}>
            Düzenle
          </Button>
          <Button size="small" startIcon={<DeleteIcon />} color="error" onClick={() => onDelete(post.id)}>
            Sil
          </Button>
        </>
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