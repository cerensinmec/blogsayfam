import React from 'react';
import { Card, CardContent, Box, Chip, IconButton, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const NoteCard = ({ note, onDelete }) => (
  <Card variant="outlined">
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Chip
          icon={<PersonIcon />}
          label={note.userEmail}
          size="small"
          color="primary"
          variant="outlined"
        />
        <IconButton
          size="small"
          onClick={() => onDelete(note.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {note.content}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {note.createdAt?.toDate?.()?.toLocaleString() || 'Tarih bilgisi yok'}
      </Typography>
    </CardContent>
  </Card>
);

NoteCard.propTypes = {
  note: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default NoteCard; 