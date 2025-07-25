import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';

const RelatedPostsList = ({ relatedPosts, navigate, formatDate }) => (
  relatedPosts.length > 0 && (
    <Card sx={{ 
      bgcolor: 'white',
      border: '3px solid #5A0058',
      borderRadius: 2,
      boxShadow: '0 4px 8px rgba(90, 0, 88, 0.1)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ 
          color: '#5A0058', 
          fontWeight: 700,
          mb: 2
        }}>
          İlgili Yazılar
        </Typography>
        <List sx={{ p: 0 }}>
          {relatedPosts.map((relatedPost) => (
            <ListItem
              key={relatedPost.id}
              button
              onClick={() => navigate(`/blog/${relatedPost.id}`)}
              sx={{ 
                px: 0,
                py: 1,
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  bgcolor: 'rgba(90, 0, 88, 0.05)'
                }
              }}
            >
              <ListItemText
                primary={relatedPost.title}
                secondary={`${relatedPost.authorName} • ${formatDate(relatedPost.createdAt)}`}
                primaryTypographyProps={{ 
                  variant: 'body2', 
                  fontWeight: 600,
                  color: '#5A0058',
                  sx: { lineHeight: 1.4 }
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  color: '#5A0058',
                  opacity: 0.7
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
);

RelatedPostsList.propTypes = {
  relatedPosts: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired
};

export default RelatedPostsList; 