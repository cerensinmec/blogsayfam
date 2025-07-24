import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const ChatWindow = ({ 
  currentUser, 
  selectedConversation, 
  selectedUser, 
  onConversationCreated 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Mesajları dinle
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', selectedConversation.id),
      orderBy('sentAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageData);
      setLoading(false);
      
      // Okunmamış mesajları okundu olarak işaretle
      markMessagesAsRead(messageData);
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  // Mesajları okundu olarak işaretle
  const markMessagesAsRead = async (messageList) => {
    if (!currentUser || !selectedConversation) return;

    const unreadMessages = messageList.filter(msg => 
      msg.receiverId === currentUser.uid && !msg.read
    );

    for (const message of unreadMessages) {
      try {
        await updateDoc(doc(db, 'messages', message.id), { read: true });
      } catch (error) {
        console.error('Mesaj okundu işaretleme hatası:', error);
      }
    }

    // Konuşmadaki okunmamış sayısını güncelle
    if (unreadMessages.length > 0) {
      try {
        const conversationRef = doc(db, 'conversations', selectedConversation.id);
        await updateDoc(conversationRef, {
          [`unreadCount.${currentUser.uid}`]: 0
        });
      } catch (error) {
        console.error('Okunmamış sayı güncelleme hatası:', error);
      }
    }
  };

  // Otomatik scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Yeni konuşma oluştur
  const createNewConversation = async (targetUser) => {
    try {
      // Mevcut konuşma var mı kontrol et
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      const existingConversation = snapshot.docs.find(doc => {
        const data = doc.data();
        return data.participants.includes(targetUser.id);
      });

      if (existingConversation) {
        const conversationData = {
          id: existingConversation.id,
          ...existingConversation.data()
        };
        onConversationCreated(conversationData);
        return conversationData;
      }

      // Yeni konuşma oluştur
      const conversationData = {
        participants: [currentUser.uid, targetUser.id],
        participantNames: [currentUser.displayName, targetUser.displayName],
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastSenderId: '',
        createdAt: serverTimestamp(),
        unreadCount: {
          [currentUser.uid]: 0,
          [targetUser.id]: 0
        }
      };

      const docRef = await addDoc(collection(db, 'conversations'), conversationData);
      const newConversation = { id: docRef.id, ...conversationData };
      onConversationCreated(newConversation);
      return newConversation;
    } catch (error) {
      console.error('Konuşma oluşturma hatası:', error);
      return null;
    }
  };

  // Mesaj gönder
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    let conversation = selectedConversation;
    
    // Yeni konuşma ise oluştur
    if (!conversation && selectedUser) {
      conversation = await createNewConversation(selectedUser);
      if (!conversation) return;
    }

    if (!conversation) return;

    setSending(true);
    try {
      const otherUserId = conversation.participants.find(id => id !== currentUser.uid);
      
      // Mesajı ekle
      await addDoc(collection(db, 'messages'), {
        conversationId: conversation.id,
        senderId: currentUser.uid,
        receiverId: otherUserId,
        message: newMessage.trim(),
        sentAt: serverTimestamp(),
        read: false,
        messageType: 'text'
      });

      // Konuşmayı güncelle
      await updateDoc(doc(db, 'conversations', conversation.id), {
        lastMessage: newMessage.trim(),
        lastMessageTime: serverTimestamp(),
        lastSenderId: currentUser.uid,
        [`unreadCount.${otherUserId}`]: (conversation.unreadCount?.[otherUserId] || 0) + 1
      });

      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherUser = () => {
    if (selectedUser) return selectedUser;
    if (!selectedConversation) return null;
    
    const otherUserId = selectedConversation.participants.find(id => id !== currentUser.uid);
    const otherUserIndex = selectedConversation.participants.indexOf(otherUserId);
    return {
      id: otherUserId,
      displayName: selectedConversation.participantNames?.[otherUserIndex] || 'Kullanıcı'
    };
  };

  const otherUser = getOtherUser();

  if (!selectedConversation && !selectedUser) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        height="100%"
        p={3}
      >
        <PersonIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" textAlign="center">
          Mesajlaşmaya Başlayın
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center">
          Sol taraftan bir konuşma seçin veya yeni bir konuşma başlatın
        </Typography>
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
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: '#fff', color: '#667eea', mr: 2 }}>
            {otherUser?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {otherUser?.displayName || 'Kullanıcı'}
          </Typography>
        </Box>
      </Box>

      {/* Mesajlar */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 1,
        background: '#f8f9fa'
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="100%"
          >
            <Typography variant="body1" color="textSecondary" textAlign="center">
              Henüz mesaj yok
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="center">
              İlk mesajı gönderin!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUser.uid;
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    backgroundColor: isOwn ? '#667eea' : '#fff',
                    color: isOwn ? 'white' : 'black',
                    borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                  }}
                >
                  <Typography variant="body1">
                    {message.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7,
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5
                    }}
                  >
                    {formatTime(message.sentAt)}
                    {isOwn && message.read && ' ✓✓'}
                    {isOwn && !message.read && ' ✓'}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Mesaj Gönderme */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px'
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            sx={{
              bgcolor: '#667eea',
              color: 'white',
              '&:hover': { bgcolor: '#5a6fd8' },
              '&:disabled': { bgcolor: '#ccc' }
            }}
          >
            {sending ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;
