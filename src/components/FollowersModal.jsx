import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Typography } from '@mui/material';

const FollowersModal = ({ open, onClose, followers, following, loading, getUserInfo }) => {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 700, 
        color: '#5A0058',
        borderBottom: '1px solid #eee'
      }}>
        {tab === 0 ? 'Takipçiler' : 'Takip Edilenler'}
      </DialogTitle>
      <Tabs 
        value={tab} 
        onChange={(_, v) => setTab(v)} 
        centered
        sx={{
          '& .MuiTab-root': {
            color: '#666',
            fontWeight: 600,
            '&:hover': {
              color: '#5A0058',
              backgroundColor: 'rgba(90, 0, 88, 0.04)'
            },
            '&.Mui-selected': {
              color: '#5A0058',
              fontWeight: 700
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#5A0058'
          }
        }}
      >
        <Tab label={`Takipçiler (${followers.length})`} />
        <Tab label={`Takip Edilenler (${following.length})`} />
      </Tabs>
      <DialogContent>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {(tab === 0 ? followers : following).length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                {tab === 0 ? 'Hiç takipçi yok.' : 'Hiç kimseyi takip etmiyor.'}
              </Typography>
            ) : (
              (tab === 0 ? followers : following).map((user, i) => (
                <ListItem 
                  key={user.uid || i} 
                  component="a" 
                  href={`/user/${user.uid}`} 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(90, 0, 88, 0.04)',
                      borderRadius: 1
                    },
                    transition: 'background-color 0.2s ease'
                  }}
                > 
                  <ListItemAvatar>
                    <Avatar 
                      src={user.photoURL && user.photoURL.startsWith('http') ? user.photoURL : null}
                      alt={user.displayName}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        bgcolor: '#5A0058',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'white'
                      }}
                    >
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={user.displayName} 
                    secondary={user.email}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                </ListItem>
              ))
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal; 