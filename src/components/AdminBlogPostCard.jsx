import React from 'react';
import { Card, CardContent, Box, Chip, IconButton, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

const AdminBlogPostCard = ({ post, onView, onEdit, onDelete, formatDate }) => (
  <Card variant="outlined">
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<PersonIcon />}
            label={post.authorName}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={post.category}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={() => onView(post.firestoreId)}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onEdit(post.firestoreId)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(post.firestoreId)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {post.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {post.content.length > 200
          ? `${post.content.substring(0, 200)}...`
          : post.content}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {post.createdAt ? formatDate(post.createdAt) : 'Tarih bilgisi yok'}
      </Typography>
    </CardContent>
  </Card>
);

AdminBlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired
};

export default AdminBlogPostCard; 