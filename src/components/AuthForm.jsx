import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  IconButton 
} from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import CloseIcon from '@mui/icons-material/Close';
import { getFirebaseErrorMessage, logError } from '../utils/errorHandler';

function AuthForm({ open, onClose, onAuthSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  // Kullanıcı adı ve e-posta benzersizlik kontrolü
  const checkUniqueness = async (email, username) => {
    setValidating(true);
    try {
      // E-posta kontrolü
      const emailQuery = query(collection(db, 'users'), where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        return { isUnique: false, field: 'email', message: 'Bu e-posta adresi zaten kullanımda.' };
      }

      // Kullanıcı adı kontrolü (sadece kayıt olma modunda)
      if (!isLogin && username) {
        const usernameQuery = query(collection(db, 'users'), where('username', '==', username));
        const usernameSnapshot = await getDocs(usernameQuery);
        
        if (!usernameSnapshot.empty) {
          return { isUnique: false, field: 'username', message: 'Bu kullanıcı adı zaten kullanımda.' };
        }
      }

      return { isUnique: true };
    } catch (error) {
      logError(error, 'Benzersizlik kontrolü');
      return { isUnique: false, field: 'general', message: 'Kontrol sırasında bir hata oluştu.' };
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Giriş yapma
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Kayıt olma - benzersizlik kontrolü
        const uniquenessCheck = await checkUniqueness(email, username);
        
        if (!uniquenessCheck.isUnique) {
          setError(uniquenessCheck.message);
          setLoading(false);
          return;
        }

        // Kullanıcı oluştur
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Kullanıcı profilini güncelle
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });

        // Firestore'da kullanıcı bilgilerini kaydet
        await setDoc(doc(db, 'users', user.uid), {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          createdAt: new Date(),
          profilePhoto: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
          bio: '',
          location: '',
          website: '',
  
        });
      }
      onAuthSuccess();
      onClose();
      // Giriş yapıldıktan sonra akış sayfasına yönlendir
      navigate('/feed');
    } catch (error) {
      logError(error, 'Kimlik doğrulama');
      setError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setUsername('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(90, 0, 88, 0.15)',
          border: '3px solid #8B5A8B',
          bgcolor: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 3, 
        bgcolor: 'white',
        borderBottom: '2px solid #8B5A8B',
        color: '#8B5A8B',
        fontWeight: 700,
        fontSize: '1.2rem'
      }}>
        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: '#8B5A8B',
            '&:hover': {
              backgroundColor: 'rgba(139, 90, 139, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 3, bgcolor: 'white' }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }} 
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          
          {!isLogin && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="İsim"
                type="text"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required={!isLogin}
                sx={{ 
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#87CEEB',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#87CEEB',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5A8B',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#8B5A8B',
                    fontWeight: 600
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8B5A8B'
                  }
                }}
                disabled={loading || validating}
              />
              <TextField
                margin="dense"
                label="Soyisim"
                type="text"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required={!isLogin}
                sx={{ 
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#87CEEB',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#87CEEB',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5A8B',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#8B5A8B',
                    fontWeight: 600
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8B5A8B'
                  }
                }}
                disabled={loading || validating}
              />
              <TextField
                margin="dense"
                label="Kullanıcı Adı"
                type="text"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                sx={{ 
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#87CEEB',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#87CEEB',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5A8B',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#8B5A8B',
                    fontWeight: 600
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8B5A8B'
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#8B5A8B',
                    fontSize: '0.75rem'
                  }
                }}
                helperText="Benzersiz bir kullanıcı adı seçin"
                disabled={loading || validating}
              />
            </>
          )}
          
          <TextField
            margin="dense"
            label="E-posta"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ 
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#87CEEB',
                  borderWidth: '2px'
                },
                '&:hover fieldset': {
                  borderColor: '#87CEEB',
                  borderWidth: '2px'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8B5A8B',
                  borderWidth: '2px'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#8B5A8B',
                fontWeight: 600
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#8B5A8B'
              },
              '& .MuiFormHelperText-root': {
                color: '#8B5A8B',
                fontSize: '0.75rem'
              }
            }}
            helperText={!isLogin ? "Benzersiz bir e-posta adresi kullanın" : ""}
            disabled={loading || validating}
          />
          <TextField
            margin="dense"
            label="Şifre"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ 
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#87CEEB',
                  borderWidth: '2px'
                },
                '&:hover fieldset': {
                  borderColor: '#87CEEB',
                  borderWidth: '2px'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8B5A8B',
                  borderWidth: '2px'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#8B5A8B',
                fontWeight: 600
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#8B5A8B'
              },
              '& .MuiFormHelperText-root': {
                color: '#8B5A8B',
                fontSize: '0.75rem'
              }
            }}
            helperText={!isLogin ? "En az 6 karakter olmalıdır" : ""}
            disabled={loading || validating}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          bgcolor: 'white',
          borderTop: '2px solid #8B5A8B',
          gap: 2
        }}>
          <Button 
            onClick={toggleMode} 
            disabled={loading || validating}
            sx={{ 
              color: '#8B5A8B',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(139, 90, 139, 0.1)'
              }
            }}
          >
            {isLogin ? 'Hesap Oluştur' : 'Giriş Yap'}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || validating}
            sx={{ 
              bgcolor: '#8B5A8B',
              fontWeight: 700,
              '&:hover': { 
                bgcolor: '#7A4A7A',
                transform: 'translateY(-1px)'
              },
              '&:disabled': { 
                bgcolor: 'rgba(139, 90, 139, 0.5)' 
              }
            }}
          >
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AuthForm; 