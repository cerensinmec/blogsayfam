import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Typography } from '@mui/material';

const FollowersModal = ({ open, onClose, followers, following, loading, getUserInfo }) => {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {tab === 0 ? 'Takipçiler' : 'Takip Edilenler'}
      </DialogTitle>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
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
                <ListItem key={user.uid || user.id || i} button component="a" href={`/user/${user.uid || user.id}`}> 
                  <ListItemAvatar>
                    <Avatar src={user.photoURL} />
                  </ListItemAvatar>
                  <ListItemText primary={user.displayName || user.username || user.email} />
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