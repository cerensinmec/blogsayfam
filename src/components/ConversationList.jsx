import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';

const ConversationList = ({ 
  currentUser, 
  onConversationSelect, 
  onNewConversation,
  selectedConversationId 
}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Konuşmaları dinle
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(conversationData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Kullanıcı arama
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('displayName'),
        limit(10)
      );
      
      const snapshot = await getDocs(q);
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => 
          user.id !== currentUser.uid &&
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      setSearchResults(users);
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
    }
    setSearchLoading(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleUserSelect = (user) => {
    onNewConversation(user);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Şimdi';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}dk`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}sa`;
    return date.toLocaleDateString('tr-TR');
  };

  const getOtherParticipant = (conversation) => {
    const otherUserId = conversation.participants.find(id => id !== currentUser.uid);
    const otherUserIndex = conversation.participants.indexOf(otherUserId);
    return {
      id: otherUserId,
      name: conversation.participantNames?.[otherUserIndex] || 'Kullanıcı'
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(45deg, #667eea, #764ba2)'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            Konuşmalar
          </Typography>
          <IconButton 
            onClick={() => setSearchOpen(true)}
            sx={{ color: 'white' }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Konuşma Listesi */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {conversations.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="100%"
            p={3}
          >
            <PersonIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="body1" color="textSecondary" textAlign="center">
              Henüz mesajınız yok
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="center">
              Yeni bir konuşma başlatmak için + butonuna tıklayın
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {conversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const unreadCount = conversation.unreadCount?.[currentUser.uid] || 0;
              const isSelected = selectedConversationId === conversation.id;

              return (
                <React.Fragment key={conversation.id}>
                  <ListItem
                    button
                    onClick={() => onConversationSelect(conversation)}
                    sx={{
                      backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#667eea' }}>
                        {otherUser.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {otherUser.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatTime(conversation.lastMessageTime)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px'
                            }}
                          >
                            {conversation.lastMessage || 'Mesaj yok'}
                          </Typography>
                          {unreadCount > 0 && (
                            <Badge 
                              badgeContent={unreadCount} 
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>

      {/* Kullanıcı Arama Dialog */}
      <Dialog 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Yeni Konuşma Başlat</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />
          
          {searchLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List>
              {searchResults.map((user) => (
                <ListItem 
                  key={user.id} 
                  button 
                  onClick={() => handleUserSelect(user)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#667eea' }}>
                      {user.displayName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={user.displayName}
                    secondary={user.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchOpen(false)}>İptal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConversationList;
