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
  onSnapshot,
  doc,
  getDoc
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
        
        // Tüm konuşmaları al (silinmiş olanlar dahil)
        const allUserConversations = allConversations.filter(conversation => 
          conversation.participants && 
          conversation.participants.includes(currentUser.uid)
        );
        
        // Her kullanıcı için sadece bir konuşma göster (en son aktif olanı)
        const userConversationMap = new Map();
        
        allUserConversations.forEach(conversation => {
          const otherUserId = conversation.participants.find(id => id !== currentUser.uid);
          
          if (!userConversationMap.has(otherUserId)) {
            // İlk konuşma - eğer silinmemişse göster
            if (!conversation.hiddenFor?.[currentUser.uid]) {
              userConversationMap.set(otherUserId, conversation);
            }
          } else {
            // Eğer aynı kullanıcıyla başka bir konuşma varsa, en son mesajı olanı seç
            const existingConversation = userConversationMap.get(otherUserId);
            const existingTime = existingConversation.lastMessageTime || 0;
            const currentTime = conversation.lastMessageTime || 0;
            
            // Eğer mevcut konuşma silinmişse ve yeni konuşma silinmemişse, yeni konuşmayı seç
            const existingHidden = existingConversation.hiddenFor?.[currentUser.uid];
            const currentHidden = conversation.hiddenFor?.[currentUser.uid];
            
            if (!currentHidden && existingHidden) {
              // Yeni konuşma silinmemiş, mevcut silinmiş - yeni konuşmayı seç
              userConversationMap.set(otherUserId, conversation);
            } else if (currentHidden && !existingHidden) {
              // Yeni konuşma silinmiş, mevcut silinmemiş - mevcut konuşmayı koru
              // Hiçbir şey yapma
            } else if (!currentHidden && !existingHidden) {
              // Her ikisi de silinmemiş - en son mesajı olanı seç
              if (currentTime > existingTime) {
                userConversationMap.set(otherUserId, conversation);
              }
            }
            // Her ikisi de silinmişse hiçbir şey yapma
          }
        });
        
        const filteredConversations = Array.from(userConversationMap.values());
        
        // Konuşmaları lastMessageTime'e göre sırala
        filteredConversations.sort((a, b) => {
          if (a.lastMessageTime && b.lastMessageTime) {
            return b.lastMessageTime - a.lastMessageTime;
          }
          return 0;
        });
        
        setConversations(filteredConversations);
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
    
    // Önce Firestore'dan gelen gerçek kullanıcı ismini kullan
    const realUserName = userNames[otherUserId];
    
    // Eğer gerçek isim yoksa, conversation'daki ismi kullan
    const otherUserName = realUserName || conversation.participantNames?.[otherUserIndex] || 'Kullanıcı';
    
    return {
      id: otherUserId,
      name: otherUserName
    };
  };

  // Kullanıcı bilgilerini Firestore'dan al
  const [userNames, setUserNames] = useState({});

  // Kullanıcı isimlerini yükle
  useEffect(() => {
    const loadUserNames = async () => {
      if (!conversations.length) return;
      
      // Sadece görünen konuşmaların kullanıcılarını al
      const userIds = conversations.map(conv => {
        const otherUserId = conv.participants.find(id => id !== currentUser.uid);
        return otherUserId;
      }).filter(Boolean);
      
      // Aynı kullanıcı ID'lerini tekrar etmeyecek şekilde al
      const uniqueUserIds = [...new Set(userIds)];
      const names = {};
      
      for (const userId of uniqueUserIds) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            names[userId] = userData.displayName || 
                           userData.firstName || 
                           userData.username || 
                           userData.email?.split('@')[0] || 
                           'Kullanıcı';
          }
        } catch (error) {
          console.error('Kullanıcı bilgisi yükleme hatası:', error);
          names[userId] = 'Kullanıcı';
        }
      }
      
      setUserNames(names);
    };
    
    loadUserNames();
  }, [conversations, currentUser.uid]);

  // Konuşma silme fonksiyonu - Sadece kendi listesinden kaldır
  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    console.log('Silme işlemi başladı:', {
      conversationId: conversationToDelete.id,
      currentUser: currentUser.uid
    });

    try {
      // Konuşmayı tamamen silmek yerine, kullanıcının konuşmayı görüp göremeyeceğini kontrol eden bir alan ekle
      const conversationRef = ref(database, `conversations/${conversationToDelete.id}`);
      
      // Mevcut konuşma verilerini al
      const conversationSnapshot = await get(conversationRef);
      const currentConversation = conversationSnapshot.val();
      
      console.log('Mevcut konuşma verileri:', currentConversation);
      
      if (currentConversation) {
        // Kullanıcının konuşmayı görüp göremeyeceğini kontrol eden alanı güncelle
        const updatedHiddenFor = {
          ...currentConversation.hiddenFor,
          [currentUser.uid]: true
        };
        
        console.log('Güncellenmiş veriler:', {
          hiddenFor: updatedHiddenFor
        });
        
        // Konuşmayı güncelle - katılımcıları değiştirme, sadece hiddenFor alanını güncelle
        await update(conversationRef, {
          hiddenFor: updatedHiddenFor
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
                <strong>{getOtherParticipant(conversationToDelete).name}</strong> ile olan sohbeti silmek istediğinizden emin misiniz?
              </>
            )}
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
