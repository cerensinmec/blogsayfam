import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

const ImageUpload = ({ 
  currentImageUrl, 
  onImageUpload, 
  onImageDelete, 
  aspectRatio = 1, 
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  showPreview = true,
  size = 'medium' // small, medium, large
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const sizeMap = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 200, height: 200 }
  };

  const { width, height } = sizeMap[size];

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error('Desteklenmeyen dosya türü. Lütfen JPEG, PNG veya WebP formatında bir resim seçin.');
    }
    if (file.size > maxSize) {
      throw new Error(`Dosya boyutu çok büyük. Maksimum ${Math.round(maxSize / 1024 / 1024)}MB olmalıdır.`);
    }
  };

  const uploadToFirebase = async (file) => {
    const timestamp = Date.now();
    const fileName = `images/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError('');
      validateFile(file);
      setUploading(true);

      const downloadURL = await uploadToFirebase(file);
      onImageUpload(downloadURL);
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

    // Video boyutlarını canvas'a ayarla
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Video frame'ini canvas'a çiz
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Canvas'tan blob oluştur
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      try {
        setError('');
        validateFile(file);
        setUploading(true);

        const downloadURL = await uploadToFirebase(file);
        onImageUpload(downloadURL);
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

  const handleDeleteImage = async () => {
    if (!currentImageUrl) return;

    try {
      setUploading(true);
      
      // Firebase Storage'dan dosyayı sil
      if (currentImageUrl.includes('firebase')) {
        const imageRef = ref(storage, currentImageUrl);
        await deleteObject(imageRef);
      }
      
      onImageDelete();
    } catch (err) {
      setError('Resim silinirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const openCameraDialog = () => {
    setShowCameraDialog(true);
    setTimeout(startCamera, 100);
  };

  const closeCameraDialog = () => {
    stopCamera();
    setShowCameraDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      {/* Mevcut Resim */}
      {currentImageUrl && showPreview && (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={currentImageUrl}
            sx={{ 
              width, 
              height,
              border: '3px solid #5A0058'
            }}
          />
          <IconButton
            onClick={handleDeleteImage}
            disabled={uploading}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'error.dark'
              },
              width: 24,
              height: 24
            }}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}

      {/* Yükleme Butonları */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<PhotoLibraryIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
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
          Galeriden Seç
        </Button>

        <Button
          variant="outlined"
          startIcon={<PhotoCameraIcon />}
          onClick={openCameraDialog}
          disabled={uploading}
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
          <CircularProgress size={20} />
          <Typography variant="body2">Yükleniyor...</Typography>
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

export default ImageUpload; 