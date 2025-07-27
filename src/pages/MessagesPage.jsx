import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  useMediaQuery,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton
} from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const MessagesPage = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(location.state?.selectedUser || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('Kullanıcı');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    console.log('MessagesPage - Kullanıcı durumu:', {
      isLoggedIn: !!user,
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName
    });
  }, [user]);

  // Seçili kullanıcının ismini yükle
  useEffect(() => {
    const loadSelectedUserName = async () => {
      if (!selectedUser && !selectedConversation) {
        setSelectedUserName('Kullanıcı');
        return;
      }
      
      let userId;
      if (selectedUser) {
        userId = selectedUser.id;
      } else if (selectedConversation) {
        userId = selectedConversation.participants.find(id => id !== user?.uid);
      }
      
      if (!userId) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const name = userData.displayName || 
                      userData.firstName || 
                      userData.username || 
                      userData.email?.split('@')[0] || 
                      'Kullanıcı';
          setSelectedUserName(name);
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi yükleme hatası:', error);
        setSelectedUserName('Kullanıcı');
      }
    };
    
    loadSelectedUserName();
  }, [selectedUser, selectedConversation, user?.uid]);

  if (!user) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <Typography variant="h6" color="textSecondary">
          Mesajlaşmak için giriş yapmalısınız
        </Typography>
      </Box>
    );
  }

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setSelectedUser(null);
  };

  const handleNewConversation = (targetUser) => {
    setSelectedUser(targetUser);
    setSelectedConversation(null);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Mevcut kullanıcıyı hariç tut ve arama sorgusuna göre filtrele
      const filteredUsers = allUsers.filter(user => {
        if (user.id === auth.currentUser?.uid) return false; // Kendini hariç tut
        
        const searchTerm = searchQuery.toLowerCase();
        const displayName = (user.displayName || '').toLowerCase();
        const username = (user.username || '').toLowerCase();
        const firstName = (user.firstName || '').toLowerCase();
        const lastName = (user.lastName || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        
        return displayName.includes(searchTerm) || 
               username.includes(searchTerm) || 
               firstName.includes(searchTerm) || 
               lastName.includes(searchTerm) || 
               email.includes(searchTerm);
      });
      
      setSearchResults(filteredUsers);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserSelect = (targetUser) => {
    setSelectedUser(targetUser);
    setSelectedConversation(null);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleSendMessage = (targetUser) => {
    // Yeni konuşma başlat
    handleNewConversation(targetUser);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'white',
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* Arama Bölümü */}
        <Box sx={{ mb: 3, position: 'relative' }}>
          <TextField
            fullWidth
            placeholder="Kullanıcı ara ve mesaj gönder..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
                                      startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#5A0058' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleSearch}
                              disabled={isSearching}
                              sx={{ color: '#5A0058' }}
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        )
            }}
                                  sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': {
                            borderWidth: '2px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#5A0058',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#5A0058',
                            borderWidth: '2px',
                          },
                        }
                      }}
          />

          {/* Arama Sonuçları */}
          {showSearchResults && searchQuery.trim() && (
            <Box sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              zIndex: 1000,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #e0e0e0',
              mt: 1,
              maxHeight: 300,
              overflowY: 'auto'
            }}>
              {searchResults.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Kullanıcı bulunamadı
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {searchResults.map((user) => (
                    <ListItem key={user.id} disablePadding>
                      <ListItemButton 
                        onClick={() => handleUserSelect(user)}
                        sx={{ 
                          p: 2,
                          '&:hover': {
                            bgcolor: '#f5f5f5'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={user.photoURL || ''} 
                            sx={{ 
                              bgcolor: '#5A0058'
                            }}
                          >
                            {user.displayName?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                              {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Bilinmeyen Kullanıcı'}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              @{user.username || 'kullanici'}
                            </Typography>
                          }
                        />
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<PersonIcon />}
                          onClick={(e) => {
                            e.stopPropagation(); // ListItemButton'ın onClick'ini engelle
                            handleSendMessage(user);
                          }}
                          sx={{ 
                            borderColor: '#5A0058',
                            color: '#5A0058',
                            '&:hover': {
                              borderColor: '#4A0048',
                              color: '#4A0048',
                              bgcolor: 'rgba(90, 0, 88, 0.1)'
                            }
                          }}
                        >
                          Mesaj Gönder
                        </Button>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Box>

        {/* Mesajlar Bölümü */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
            Mesajlar
          </Typography>
          
          {/* Mesajlar Listesi */}
          <Box sx={{ mb: 4 }}>
            <ConversationList
              currentUser={user}
              onConversationSelect={handleConversationSelect}
              onNewConversation={handleNewConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </Box>

          {/* Chat Penceresi - Konuşma seçildiğinde veya yeni konuşma başlatıldığında görünür */}
          {(selectedConversation || selectedUser) && (
            <Box sx={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid #e0e0e0',
                background: 'linear-gradient(45deg, #5A0058, #4A0048)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#fff', color: '#5A0058', mr: 2 }}>
                    {selectedUserName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                        opacity: 0.8
                      }
                    }}
                    onClick={() => {
                      const otherUserId = selectedUser?.id || 
                        (selectedConversation?.participants?.find(id => id !== user.uid));
                      if (otherUserId) {
                        navigate(`/user/${otherUserId}`);
                      }
                    }}
                  >
                    {selectedUserName}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => {
                    setSelectedConversation(null);
                    setSelectedUser(null);
                  }}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              
              {/* Chat Content */}
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <ChatWindow
                  currentUser={user}
                  selectedConversation={selectedConversation}
                  selectedUser={selectedUser}
                  onConversationCreated={handleConversationSelect}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default MessagesPage;
