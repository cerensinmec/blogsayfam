import React, { useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { Container, Typography, Box, TextField, Button, Paper, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LoadingSpinner from '../components/LoadingSpinner';

function NotesPage() {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, 'notes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setLoading(false);
      setError(null);
    }, (error) => {
      console.error('Notlar yüklenirken hata:', error);
      setError('Notlarınız yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNote.trim()) return;
    
    try {
      await addDoc(collection(db, 'notes'), {
        title: newNoteTitle,
        content: newNote,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp()
      });
      setNewNote('');
      setNewNoteTitle('');
      setError(null);
    } catch (error) {
      console.error('Not eklenirken hata:', error);
      setError('Not eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu notu silmek istediğine emin misin?')) {
      try {
        await deleteDoc(doc(db, 'notes', id));
        setError(null);
      } catch (error) {
        console.error('Not silinirken hata:', error);
        setError('Not silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const handleEditOpen = (note) => {
    setEditNoteId(note.id);
    setEditNoteTitle(note.title || '');
    setEditNoteContent(note.content || '');
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditNoteId(null);
    setEditNoteTitle('');
    setEditNoteContent('');
  };

  const handleEditSave = async () => {
    if (!editNoteTitle.trim() || !editNoteContent.trim()) {
      setError('Başlık ve içerik boş olamaz!');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'notes', editNoteId), {
        title: editNoteTitle.trim(),
        content: editNoteContent.trim(),
        updatedAt: serverTimestamp()
      });
      setEditDialogOpen(false);
      setEditNoteId(null);
      setEditNoteTitle('');
      setEditNoteContent('');
      setError(null);
    } catch (error) {
      console.error('Not güncellenirken hata:', error);
      setError('Not güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography variant="h5" align="center">Notlarım</Typography>
        <Typography align="center" sx={{ mt: 2 }}>Notlarınızı görmek için giriş yapmalısınız.</Typography>
      </Container>
    );
  }

  // Kullanıcıya özel hoşgeldin mesajı
  const displayName = user.displayName || user.email || 'Kullanıcı';

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, pb: { xs: 4, md: 6 }, minHeight: 'calc(100vh - 120px)', px: { xs: 1, md: 2 }, width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Notlarım</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleAddNote}>
          <TextField
            label="Başlık"
            value={newNoteTitle}
            onChange={e => setNewNoteTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Notunuz"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Not Ekle
          </Button>
        </form>
      </Paper>
      
      <Box>
        {loading ? (
          <LoadingSpinner message="Notlarınız yükleniyor..." />
        ) : notes.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Henüz notunuz yok.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              İlk notunuzu yukarıdaki formu kullanarak ekleyebilirsiniz.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {notes.map(note => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note.id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1, pr: 2 }}>{note.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => handleEditOpen(note)} sx={{ color: 'primary.main' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(note.id)} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {note.content}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Notu Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            label="Başlık"
            value={editNoteTitle}
            onChange={e => setEditNoteTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="İçerik"
            value={editNoteContent}
            onChange={e => setEditNoteContent(e.target.value)}
            fullWidth
            multiline
            minRows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>İptal</Button>
          <Button onClick={handleEditSave} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default NotesPage; 