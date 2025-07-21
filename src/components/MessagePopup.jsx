import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function MessagePopup({
  open,
  onClose,
  title = 'İletmek istediğiniz bir mesaj var mı?',
  inputLabel = 'Mesajınız (isteğe bağlı)',
  value,
  onChange,
  onSend,
  loading = false,
  showSendButton = false
}) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Dışarıdan value/onChange gelirse onları kullan, yoksa local state kullan
  const isControlled = typeof value === 'string' && typeof onChange === 'function';
  const inputValue = isControlled ? value : message;
  const handleInputChange = (e) => {
    if (isControlled) {
      onChange(e);
    } else {
      setMessage(e.target.value);
    }
  };

  const handleSend = async () => {
    if (showSendButton && onSend) {
      await onSend();
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 1200);
    } else {
      setSent(true);
      setTimeout(() => {
        setMessage('');
        setSent(false);
        onClose();
      }, 1500);
    }
  };

  // Modal kapandığında local state'i sıfırla
  useEffect(() => {
    if (!open) {
      setMessage('');
      setSent(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {title}
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
          <Typography color="success.main">Yorumunuz iletildi!</Typography>
        ) : (
          <TextField
            autoFocus
            margin="dense"
            label={inputLabel}
            type="text"
            fullWidth
            multiline
            minRows={2}
            value={inputValue}
            onChange={handleInputChange}
            disabled={loading}
          />
        )}
      </DialogContent>
      <DialogActions>
        {!sent && showSendButton && (
          <Button onClick={handleSend} variant="contained" disabled={loading || !inputValue.trim()}>
            {loading ? <CircularProgress size={20} /> : 'Gönder'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default MessagePopup; 