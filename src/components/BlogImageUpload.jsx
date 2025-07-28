import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  TextField
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Close as CloseIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const BlogImageUpload = ({ onImageInsert, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const maxSize = 10 * 1024 * 1024; // 10MB
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error('Desteklenmeyen dosya türü. Lütfen JPEG, PNG, WebP veya GIF formatında bir resim seçin.');
    }
    if (file.size > maxSize) {
      throw new Error(`Dosya boyutu çok büyük. Maksimum ${Math.round(maxSize / 1024 / 1024)}MB olmalıdır.`);
    }
  };

  const uploadToFirebase = async (file) => {
    const timestamp = Date.now();
    const fileName = `blog-images/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const insertImageToContent = (imageUrl, caption = '') => {
    const imageData = {
      url: imageUrl,
      caption: caption
    };
    
    onImageInsert(imageData);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError('');
      validateFile(file);
      setUploading(true);

      const downloadURL = await uploadToFirebase(file);
      insertImageToContent(downloadURL, imageCaption);
      setImageCaption('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      try {
        setError('');
        validateFile(file);
        setUploading(true);

        const downloadURL = await uploadToFirebase(file);
        insertImageToContent(downloadURL, imageCaption);
        setImageCaption('');
        setShowCameraDialog(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.8);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Kamera erişimi sağlanamadı. Lütfen kamera izinlerini kontrol edin.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const openCameraDialog = () => {
    setShowCameraDialog(true);
    setTimeout(startCamera, 100);
  };

  const closeCameraDialog = () => {
    stopCamera();
    setShowCameraDialog(false);
    setImageCaption('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      {/* Fotoğraf Ekleme Butonları */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PhotoLibraryIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
          sx={{
            borderColor: '#5A0058',
            color: '#5A0058',
            '&:hover': {
              bgcolor: '#5A0058',
              color: 'white',
              borderColor: '#5A0058'
            }
          }}
        >
          Galeriden Ekle
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<PhotoCameraIcon />}
          onClick={openCameraDialog}
          disabled={uploading || disabled}
          sx={{
            borderColor: '#5A0058',
            color: '#5A0058',
            '&:hover': {
              bgcolor: '#5A0058',
              color: 'white',
              borderColor: '#5A0058'
            }
          }}
        >
          Kamera ile Çek
        </Button>
      </Box>

      {/* Yükleme İndikatörü */}
      {uploading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2">Fotoğraf yükleniyor...</Typography>
        </Box>
      )}

      {/* Gizli Dosya Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Kamera Dialog */}
      <Dialog
        open={showCameraDialog}
        onClose={closeCameraDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Fotoğraf Çek</Typography>
            <IconButton onClick={closeCameraDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Paper
              sx={{
                width: '100%',
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'black',
                overflow: 'hidden'
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Paper>
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            <TextField
              label="Fotoğraf Açıklaması (İsteğe bağlı)"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              fullWidth
              size="small"
              placeholder="Fotoğrafınız için bir açıklama ekleyin..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCameraDialog}>
            İptal
          </Button>
          <Button
            onClick={handleCameraCapture}
            variant="contained"
            disabled={uploading}
            sx={{
              bgcolor: '#5A0058',
              '&:hover': {
                bgcolor: '#4A0047'
              }
            }}
          >
            Fotoğraf Çek
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogImageUpload; 