import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';

const RelatedPostsList = ({ relatedPosts, navigate, formatDate }) => (
  relatedPosts.length > 0 && (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          İlgili Yazılar
        </Typography>
        <List>
          {relatedPosts.map((relatedPost) => (
            <ListItem
              key={relatedPost.id}
              button
              onClick={() => navigate(`/blog/${relatedPost.id}`)}
              sx={{ px: 0 }}
            >
              <ListItemText
                primary={relatedPost.title}
                secondary={`${relatedPost.authorName} • ${formatDate(relatedPost.createdAt)}`}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                secondaryTypographyProps={{ variant: 'caption' }}
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