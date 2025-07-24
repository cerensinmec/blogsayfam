import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const MessagesPage = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(location.state?.selectedUser || null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  return (
    <Box sx={{ 
      minHeight: '80vh', 
      p: 2,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'white', 
          textAlign: 'center', 
          mb: 3,
          fontWeight: 'bold'
        }}
      >
        💬 Mesajlarım
      </Typography>

      <Grid container spacing={2} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Konuşma Listesi */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '70vh', 
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <ConversationList
              currentUser={user}
              onConversationSelect={handleConversationSelect}
              onNewConversation={handleNewConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </Paper>
        </Grid>

        {/* Chat Penceresi */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '70vh', 
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <ChatWindow
              currentUser={user}
              selectedConversation={selectedConversation}
              selectedUser={selectedUser}
              onConversationCreated={handleConversationSelect}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagesPage;
