import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function MessagePopup({ open, onClose }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    // Burada mesajı backend'e gönderebilir veya başka bir işlem yapabilirsin
    console.log('Kullanıcı mesajı:', message);
    setTimeout(() => {
      setMessage('');
      setSent(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        İletmek istediğiniz bir mesaj var mı?
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {sent ? (
          <Typography color="success.main">Mesajınız iletildi!</Typography>
        ) : (
          <TextField
            autoFocus
            margin="dense"
            label="Mesajınız (isteğe bağlı)"
            type="text"
            fullWidth
            multiline
            minRows={2}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        {!sent && (
          <Button onClick={handleSend} variant="contained" disabled={!message.trim()}>
            Gönder
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default MessagePopup; 