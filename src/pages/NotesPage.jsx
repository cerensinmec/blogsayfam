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
import { Container, Typography, Box, TextField, Button, Paper, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, 'notes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
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
    } catch (error) {
      alert('Not eklenirken hata oluştu!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu notu silmek istediğine emin misin?')) {
      await deleteDoc(doc(db, 'notes', id));
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
      alert('Başlık ve içerik boş olamaz!');
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
    } catch (error) {
      console.error('Not güncellenirken hata:', error);
      alert('Not güncellenirken hata oluştu!');
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
    <Container maxWidth="sm" sx={{ py: 6, pb: 8, minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>Notlarım</Typography>
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
          <Typography align="center">Yükleniyor...</Typography>
        ) : notes.length === 0 ? (
          <Typography align="center">Henüz notunuz yok.</Typography>
        ) : (
          <Grid container spacing={2}>
            {notes.map(note => (
              <Grid item xs={12} key={note.id}>
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
            required
          />
          <TextField
            label="Notunuz"
            value={editNoteContent}
            onChange={e => setEditNoteContent(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="inherit">İptal</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default NotesPage; 