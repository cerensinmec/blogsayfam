import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ref, onValue, off, get, update } from 'firebase/database';
import { database } from '../firebase/config';

const ConversationList = ({ 
  currentUser, 
  onConversationSelect, 
  onNewConversation,
  selectedConversationId 
}) => {
  const [conversations, setConversations] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);

  // Konuşmaları dinle
  useEffect(() => {
    if (!currentUser) return;

    // Realtime Database'den konuşmaları dinle
    const conversationsRef = ref(database, 'conversations');
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Tüm konuşmaları al ve currentUser'ın katıldığı konuşmaları filtrele
        const allConversations = Object.entries(data).map(([id, conversation]) => ({
          id,
          ...conversation
        }));
        
        const userConversations = allConversations.filter(conversation => 
          conversation.participants && conversation.participants.includes(currentUser.uid)
        );
        
        // Konuşmaları lastMessageTime'e göre sırala
        userConversations.sort((a, b) => {
          if (a.lastMessageTime && b.lastMessageTime) {
            return b.lastMessageTime - a.lastMessageTime;
          }
          return 0;
        });
        
        setConversations(userConversations);
      } else {
        setConversations([]);
      }
    });

    return () => {
      off(conversationsRef);
    };
  }, [currentUser]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    let date;
    if (typeof timestamp === 'number') {
      // Realtime Database timestamp (number)
      date = new Date(timestamp);
    } else if (timestamp.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else {
      return '';
    }
    
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
    const otherUserName = conversation.participantNames?.[otherUserIndex] || 'Kullanıcı';
    
    return {
      id: otherUserId,
      name: otherUserName
    };
  };

  // Konuşma silme fonksiyonu - Sadece kendi listesinden kaldır
  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    console.log('Silme işlemi başladı:', {
      conversationId: conversationToDelete.id,
      currentUser: currentUser.uid
    });

    try {
      // Konuşmayı tamamen silmek yerine, kullanıcıyı katılımcılardan çıkar
      const conversationRef = ref(database, `conversations/${conversationToDelete.id}`);
      
      // Mevcut konuşma verilerini al
      const conversationSnapshot = await get(conversationRef);
      const currentConversation = conversationSnapshot.val();
      
      console.log('Mevcut konuşma verileri:', currentConversation);
      
      if (currentConversation) {
        // Kullanıcıyı katılımcılardan çıkar
        const updatedParticipants = currentConversation.participants.filter(
          participantId => participantId !== currentUser.uid
        );
        
        // Katılımcı isimlerini de güncelle
        const updatedParticipantNames = currentConversation.participantNames.filter(
          (_, index) => currentConversation.participants[index] !== currentUser.uid
        );
        
        // Unread count'tan kullanıcıyı çıkar
        const updatedUnreadCount = { ...currentConversation.unreadCount };
        delete updatedUnreadCount[currentUser.uid];
        
        console.log('Güncellenmiş veriler:', {
          updatedParticipants,
          updatedParticipantNames,
          updatedUnreadCount
        });
        
        // Konuşmayı güncelle
        await update(conversationRef, {
          participants: updatedParticipants,
          participantNames: updatedParticipantNames,
          unreadCount: updatedUnreadCount
        });
        
        console.log('Konuşma başarıyla güncellendi');
      } else {
        console.log('Konuşma bulunamadı');
      }

      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    } catch (error) {
      console.error('Konuşma silme hatası:', error);
      console.error('Hata detayları:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    }
  };

  const openDeleteDialog = (conversation, event) => {
    event.stopPropagation(); // Konuşma seçimini engelle
    setConversationToDelete(conversation);
    setDeleteDialogOpen(true);
  };



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Konuşma Listesi */}
      <Box>
        {conversations.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            p={4}
            sx={{ 
              bgcolor: '#f8f9fa', 
              borderRadius: 2, 
              border: '2px dashed #dee2e6',
              minHeight: '200px'
            }}
          >
            <PersonIcon sx={{ fontSize: 60, color: '#5A0058', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ mb: 1 }}>
              Henüz mesajınız yok
            </Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center">
              Yeni bir konuşma başlatmak için üstteki arama çubuğunu kullanın
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {conversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const unreadCount = conversation.unreadCount?.[currentUser.uid] || 0;
              const isSelected = selectedConversationId === conversation.id;

              return (
                <Box
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 3,
                    bgcolor: isSelected ? '#f8f9fa' : 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: '#5A0058', width: 50, height: 50 }}>
                    {otherUser.name.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                        {otherUser.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          {formatTime(conversation.lastMessageTime)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => openDeleteDialog(conversation, e)}
                          sx={{
                            color: '#5A0058',
                            '&:hover': {
                              bgcolor: 'rgba(90, 0, 88, 0.1)',
                              color: '#4A0048'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '300px'
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
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Silme Onay Dialogu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#5A0058', fontWeight: 600 }}>
          Konuşmayı Listeden Kaldır
        </DialogTitle>
        <DialogContent>
          <Typography>
            {conversationToDelete && (
              <>
                <strong>{getOtherParticipant(conversationToDelete).name}</strong> ile olan konuşmayı listenizden kaldırmak istediğinizden emin misiniz?
              </>
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Bu işlem sadece sizin mesaj listenizden konuşmayı kaldırır. Karşı tarafın mesajları etkilenmez ve size mesaj göndermeye devam edebilir.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              color: '#5A0058',
              '&:hover': {
                bgcolor: 'rgba(90, 0, 88, 0.1)',
                color: '#4A0048'
              }
            }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleDeleteConversation}
            variant="contained"
            sx={{ 
              bgcolor: '#5A0058',
              '&:hover': { bgcolor: '#4A0048' }
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConversationList;
