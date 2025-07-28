import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Divider,
  Button
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  CameraAlt as CameraIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon
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
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ref, push, set, onValue, off, get, child, update } from 'firebase/database';
import { database } from '../firebase/config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import ImageUpload from './ImageUpload';
import EmojiPicker from 'emoji-picker-react';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('Yüz İfadeleri');
  const messagesEndRef = useRef(null);

  // Kapsamlı emoji kategorileri
  const emojiCategories = {
    'Yüz İfadeleri': ['😊', '😂', '😍', '🥰', '😅', '😘', '😋', '😴', '🤗', '😎', '🤔', '😭', '😡', '😱', '😴', '🤤', '😪', '😵', '🤯', '😤', '😠', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
    'İnsanlar': ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👮‍♀️', '👮', '👷‍♀️', '👷', '👸', '🤴', '👳‍♀️', '👳', '👲', '🧕', '🤵‍♀️', '🤵', '👰‍♀️', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🧙‍♀️', '🧙', '🧚‍♀️', '🧚', '🧛‍♀️', '🧛', '🧜‍♀️', '🧜', '🧝‍♀️', '🧝', '🧞‍♀️', '🧞', '🧟‍♀️', '🧟', '💆‍♀️', '💆', '💇‍♀️', '💇', '🚶‍♀️', '🚶', '🧍‍♀️', '🧍', '🧎‍♀️', '🧎', '🏃‍♀️', '🏃', '💃', '🕺', '🕴️', '👯‍♀️', '👯', '🧖‍♀️', '🧖', '👭', '👫', '👬', '💏', '💑', '🗣️', '👤', '👥', '👣'],
    'Hayvanlar & Doğa': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    'Yemek & İçecek': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍷', '🥂', '🥃', '🍸', '🍹', '🧉', '🍾', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],
    'Aktiviteler': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷️', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🤼‍♀️', '🤼', '🤸‍♀️', '🤸', '⛹️‍♀️', '⛹️', '🤺', '🤾‍♀️', '🤾', '🏌️‍♀️', '🏌️', '🏇', '🧘‍♀️', '🧘', '🏄‍♀️', '🏄', '🏊‍♀️', '🏊', '🤽‍♀️', '🤽', '🚣‍♀️', '🚣', '🏊‍♀️', '🏊', '🚴‍♀️', '🚴', '🚵‍♀️', '🚵', '🎯', '🎮', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🎙️', '🎚️', '🎛️', '🎜️', '🎝️', '🎞️', '🎟️', '🎠', '🎡', '🎢', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻'],
    'Semboller': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  };

  // Mesajları dinle
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    setLoading(true);
    
    // Realtime Database'den mesajları dinle
    const messagesRef = ref(database, 'messages');
    console.log('Realtime Database bağlantısı test ediliyor...', database.app.options.databaseURL);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      console.log('Realtime Database veri alındı:', snapshot.val());
      const data = snapshot.val();
      if (data) {
        // Tüm mesajları al ve conversationId'ye göre filtrele
        const allMessages = Object.entries(data).map(([id, message]) => ({
          id,
          ...message
        }));
        
        const conversationMessages = allMessages.filter(
          msg => msg.conversationId === selectedConversation.id
        );
        
        // Eğer kullanıcı bu konuşmayı silmişse mesajları gösterme
        if (selectedConversation.hiddenFor?.[currentUser.uid]) {
          setMessages([]);
          setLoading(false);
          return;
        }
        
        console.log('Filtrelenmiş mesajlar:', conversationMessages);
        
        // Mesajları sentAt'e göre sırala
        conversationMessages.sort((a, b) => {
          if (a.sentAt && b.sentAt) {
            return a.sentAt - b.sentAt;
          }
          return 0;
        });
        
        setMessages(conversationMessages);
        setLoading(false);
        
        // Okunmamış mesajları okundu olarak işaretle
        markMessagesAsRead(conversationMessages);
      } else {
        console.log('Realtime Database boş');
        setMessages([]);
        setLoading(false);
      }
    }, (error) => {
      console.error('Realtime Database mesaj yükleme hatası:', error);
      setLoading(false);
    });

    return () => {
      off(messagesRef);
    };
  }, [selectedConversation]);

  // Mesajları okundu olarak işaretle
  const markMessagesAsRead = async (messageList) => {
    if (!currentUser || !selectedConversation) return;

    const unreadMessages = messageList.filter(msg => 
      msg.receiverId === currentUser.uid && !msg.read
    );

    for (const message of unreadMessages) {
      try {
        // Realtime Database'de mesajı okundu olarak işaretle
        const messageRef = ref(database, `messages/${message.id}`);
        await update(messageRef, { read: true });
      } catch (error) {
        console.error('Mesaj okundu işaretleme hatası:', error);
      }
    }

    // Konuşmadaki okunmamış sayısını güncelle (Realtime Database'de)
    if (unreadMessages.length > 0) {
      try {
        const conversationRef = ref(database, `conversations/${selectedConversation.id}/unreadCount/${currentUser.uid}`);
        await set(conversationRef, 0);
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
      console.log('Konuşma oluşturma başladı:', { currentUser: currentUser.uid, targetUser: targetUser.id });
      
      // Mevcut konuşma var mı kontrol et (Realtime Database'den)
      const conversationsRef = ref(database, 'conversations');
      console.log('Realtime Database bağlantısı kontrol ediliyor...');
      
      const snapshot = await get(conversationsRef);
      const conversations = snapshot.val();
      console.log('Mevcut konuşmalar:', conversations);
      
      let existingConversation = null;
      if (conversations) {
        const conversationEntries = Object.entries(conversations);
        existingConversation = conversationEntries.find(([id, conversation]) => {
          return conversation.participants && 
                 conversation.participants.includes(currentUser.uid) && 
                 conversation.participants.includes(targetUser.id);
          // hiddenFor kontrolünü kaldırdık çünkü karşı tarafın konuşmayı silip silmediğine bakmamız gerekiyor
        });
      }

      if (existingConversation) {
        console.log('Mevcut konuşma bulundu:', existingConversation);
        const [id, conversationData] = existingConversation;
        const conversation = { id, ...conversationData };
        onConversationCreated(conversation);
        return conversation;
      }

      // Yeni konuşma oluştur (Realtime Database'de)
      console.log('Yeni konuşma oluşturuluyor...');
      const newConversationRef = push(conversationsRef);
      
      // Kullanıcı isimlerini güvenli şekilde al
      const currentUserName = currentUser.displayName || currentUser.firstName || currentUser.email?.split('@')[0] || 'Kullanıcı';
      const targetUserName = targetUser.displayName || targetUser.firstName || targetUser.email?.split('@')[0] || 'Kullanıcı';
      
      const conversationData = {
        participants: [currentUser.uid, targetUser.id],
        participantNames: [currentUserName, targetUserName],
        lastMessage: '',
        lastMessageTime: Date.now(),
        lastSenderId: '',
        createdAt: Date.now(),
        unreadCount: {
          [currentUser.uid]: 0,
          [targetUser.id]: 0
        },
        hiddenFor: {} // Kullanıcıların konuşmayı silip silmediğini kontrol eden alan
      };

      console.log('Konuşma verisi:', conversationData);
      console.log('Konuşma referansı:', newConversationRef.key);
      
      await set(newConversationRef, conversationData);
      console.log('Konuşma başarıyla oluşturuldu');
      
      const newConversation = { id: newConversationRef.key, ...conversationData };
      onConversationCreated(newConversation);
      return newConversation;
    } catch (error) {
      console.error('Konuşma oluşturma hatası:', error);
      console.error('Hata detayları:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
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

    // Eğer konuşma varsa ama kullanıcı silmişse, tekrar aktif hale getir
    if (conversation && conversation.hiddenFor?.[currentUser.uid]) {
      try {
        const conversationRef = ref(database, `conversations/${conversation.id}`);
        await update(conversationRef, {
          [`hiddenFor/${currentUser.uid}`]: false
        });
        // Konuşmayı güncelle
        conversation.hiddenFor = {
          ...conversation.hiddenFor,
          [currentUser.uid]: false
        };
      } catch (error) {
        console.error('Konuşma aktif hale getirme hatası:', error);
      }
    }

    if (!conversation) return;

    setSending(true);
    try {
      const otherUserId = conversation.participants.find(id => id !== currentUser.uid);
      
      const messageData = {
        conversationId: conversation.id,
        senderId: currentUser.uid,
        receiverId: otherUserId,
        message: newMessage.trim(),
        sentAt: Date.now(), // Realtime Database için timestamp
        read: false,
        messageType: 'text'
      };

      console.log('Mesaj gönderiliyor:', messageData);

      // Realtime Database'e mesajı ekle
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      const messageWithId = { id: newMessageRef.key, ...messageData };
      await set(newMessageRef, messageWithId);

      console.log('Mesaj başarıyla gönderildi:', messageWithId);

      // Konuşmayı güncelle (Realtime Database'de)
      const conversationRef = ref(database, `conversations/${conversation.id}`);
      const updateData = {
        lastMessage: newMessage.trim(),
        lastMessageTime: Date.now(),
        lastSenderId: currentUser.uid,
        [`unreadCount/${otherUserId}`]: (conversation.unreadCount?.[otherUserId] || 0) + 1
      };
      
      // Eğer karşı taraf konuşmayı silmişse, tekrar görünür yap
      if (conversation.hiddenFor?.[otherUserId]) {
        updateData[`hiddenFor/${otherUserId}`] = false;
      }
      
      // Eğer kendim konuşmayı silmişsem, tekrar aktif hale getir
      if (conversation.hiddenFor?.[currentUser.uid]) {
        updateData[`hiddenFor/${currentUser.uid}`] = false;
      }
      
      await update(conversationRef, updateData);

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

  const handleImageUpload = async (imageUrl) => {
    if (!imageUrl || sending || uploadingImage) return;

    let conversation = selectedConversation;
    
    // Yeni konuşma ise oluştur
    if (!conversation && selectedUser) {
      conversation = await createNewConversation(selectedUser);
      if (!conversation) return;
    }

    if (!conversation) return;

    setUploadingImage(true);
    try {
      const otherUserId = conversation.participants.find(id => id !== currentUser.uid);
      
      const messageData = {
        conversationId: conversation.id,
        senderId: currentUser.uid,
        receiverId: otherUserId,
        message: imageUrl,
        sentAt: Date.now(),
        read: false,
        messageType: 'image'
      };

      console.log('Fotoğraf mesajı gönderiliyor:', messageData);

      // Realtime Database'e mesajı ekle
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      const messageWithId = { id: newMessageRef.key, ...messageData };
      await set(newMessageRef, messageWithId);

      console.log('Fotoğraf mesajı başarıyla gönderildi:', messageWithId);

      // Konuşmayı güncelle
      const conversationRef = ref(database, `conversations/${conversation.id}`);
      const updateData = {
        lastMessage: '📸 Fotoğraf',
        lastMessageTime: Date.now(),
        lastSenderId: currentUser.uid,
        [`unreadCount/${otherUserId}`]: (conversation.unreadCount?.[otherUserId] || 0) + 1
      };
      
      await update(conversationRef, updateData);

      setShowImageUpload(false);
    } catch (error) {
      console.error('Fotoğraf gönderme hatası:', error);
    }
    setUploadingImage(false);
  };

  const handleQuickEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

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
    
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const [otherUserName, setOtherUserName] = useState('Kullanıcı');

  // Diğer kullanıcının ismini Firestore'dan al
  useEffect(() => {
    const loadOtherUserName = async () => {
      if (!selectedConversation && !selectedUser) return;
      
      let otherUserId;
      if (selectedUser) {
        otherUserId = selectedUser.id;
      } else if (selectedConversation) {
        otherUserId = selectedConversation.participants.find(id => id !== currentUser.uid);
      }
      
      if (!otherUserId) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const name = userData.displayName || 
                      userData.firstName || 
                      userData.username || 
                      userData.email?.split('@')[0] || 
                      'Kullanıcı';
          setOtherUserName(name);
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi yükleme hatası:', error);
        setOtherUserName('Kullanıcı');
      }
    };
    
    loadOtherUserName();
  }, [selectedConversation, selectedUser, currentUser.uid]);

  const getOtherUser = () => {
    if (selectedUser) return selectedUser;
    if (!selectedConversation) return null;
    
    const otherUserId = selectedConversation.participants.find(id => id !== currentUser.uid);
    
    return {
      id: otherUserId,
      displayName: otherUserName
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
                    backgroundColor: isOwn ? '#5A0058' : '#fff',
                    color: isOwn ? 'white' : 'black',
                    borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                  }}
                >
                  {message.messageType === 'image' ? (
                    <Box>
                      <img
                        src={message.message}
                        alt="Mesaj fotoğrafı"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 300,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(message.message, '_blank')}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body1">
                      {message.message}
                    </Typography>
                  )}
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
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => setShowImageUpload(true)}
            disabled={uploadingImage}
            sx={{
              color: '#5A0058',
              '&:hover': { bgcolor: 'rgba(90, 0, 88, 0.1)' }
            }}
            title="Fotoğraf ekle"
          >
            {uploadingImage ? <CircularProgress size={20} /> : <CameraIcon />}
          </IconButton>
          <IconButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            sx={{
              color: '#5A0058',
              '&:hover': { bgcolor: 'rgba(90, 0, 88, 0.1)' }
            }}
            title="Emoji ekle"
          >
            <EmojiIcon />
          </IconButton>
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
              bgcolor: '#5A0058',
              color: 'white',
              '&:hover': { bgcolor: '#4A0048' },
              '&:disabled': { bgcolor: '#ccc' }
            }}
          >
            {sending ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </Box>

        {/* Kategorili Emoji Picker */}
        {showEmojiPicker && (
          <Box sx={{ 
            position: 'absolute',
            bottom: '100%',
            left: 80,
            zIndex: 1000,
            mb: 1,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            width: 400,
            maxHeight: 500
          }}>
            {/* Kategori Sekmeleri */}
            <Box sx={{ 
              display: 'flex', 
              borderBottom: '1px solid #e0e0e0',
              bgcolor: '#f8f9fa'
            }}>
              {Object.keys(emojiCategories).map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedEmojiCategory(category)}
                  sx={{
                    flex: 1,
                    py: 1,
                    px: 0.5,
                    fontSize: '0.7rem',
                    color: selectedEmojiCategory === category ? '#5A0058' : '#666',
                    bgcolor: selectedEmojiCategory === category ? 'white' : 'transparent',
                    borderBottom: selectedEmojiCategory === category ? '2px solid #5A0058' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: selectedEmojiCategory === category ? 'white' : 'rgba(90, 0, 88, 0.1)'
                    }
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>

            {/* Emoji Grid */}
            <Box sx={{ 
              p: 2,
              maxHeight: 350,
              overflowY: 'auto',
              bgcolor: 'white'
            }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(8, 1fr)', 
                gap: 0.5
              }}>
                {emojiCategories[selectedEmojiCategory].map((emoji, index) => (
                  <Box
                    key={index}
                    onClick={() => handleQuickEmoji(emoji)}
                    sx={{
                      fontSize: '1.8rem',
                      p: 1,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      '&:hover': {
                        bgcolor: 'rgba(90, 0, 88, 0.08)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease',
                      filter: 'contrast(1.1) saturate(1.2)',
                      userSelect: 'none'
                    }}
                  >
                    {emoji}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Kapat Butonu */}
            <Box sx={{ 
              p: 1, 
              borderTop: '1px solid #e0e0e0',
              textAlign: 'center'
            }}>
              <Button
                size="small"
                onClick={() => setShowEmojiPicker(false)}
                sx={{ 
                  color: '#5A0058',
                  '&:hover': {
                    bgcolor: 'rgba(90, 0, 88, 0.1)'
                  }
                }}
              >
                Kapat
              </Button>
            </Box>
          </Box>
        )}

        {/* Fotoğraf Yükleme Dialogu */}
        {showImageUpload && (
          <Box sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}>
            <Box sx={{ 
              bgcolor: 'white',
              borderRadius: 2,
              p: 3,
              maxWidth: 400,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#5A0058' }}>
                📸 Fotoğraf Gönder
              </Typography>
              <ImageUpload
                onImageUpload={handleImageUpload}
                size="medium"
                showPreview={true}
                disabled={uploadingImage}
              />
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  onClick={() => setShowImageUpload(false)}
                  disabled={uploadingImage}
                  sx={{ color: 'text.secondary' }}
                >
                  İptal
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;
