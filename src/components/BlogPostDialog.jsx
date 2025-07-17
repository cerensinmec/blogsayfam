import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import PropTypes from 'prop-types';

const BlogPostDialog = ({ open, onClose, onSubmit, formData, setFormData, editingPost, error }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}</DialogTitle>
    <DialogContent>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Başlık"
        fullWidth
        margin="normal"
        value={formData.title}
        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      <TextField
        label="İçerik"
        fullWidth
        margin="normal"
        multiline
        minRows={4}
        value={formData.content}
        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Kategori</InputLabel>
        <Select
          value={formData.category}
          label="Kategori"
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
        >
          <MenuItem value="genel">Genel</MenuItem>
          <MenuItem value="teknoloji">Teknoloji</MenuItem>
          <MenuItem value="yaşam">Yaşam</MenuItem>
          <MenuItem value="eğitim">Eğitim</MenuItem>
          <MenuItem value="seyahat">Seyahat</MenuItem>
          <MenuItem value="yemek">Yemek</MenuItem>
          <MenuItem value="kişisel">Kişisel</MenuItem>
          <MenuItem value="diğer">Diğer</MenuItem>
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>İptal</Button>
      <Button onClick={onSubmit} variant="contained">Kaydet</Button>
    </DialogActions>
  </Dialog>
);

BlogPostDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  editingPost: PropTypes.object,
  error: PropTypes.string
};

export default BlogPostDialog; 