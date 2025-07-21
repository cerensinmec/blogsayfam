import React from 'react';
import { Container, Paper } from '@mui/material';

/**
 * Ortak sayfa düzeni: içerikleri ortalar, genişlik ve padding ayarlarını tek noktadan yönetir.
 * Kullanım: <PageLayout><...sayfa içeriği...></PageLayout>
 */
function PageLayout({ children, maxWidth = 'xl', minHeight = 'calc(100vh - 120px)', paper = true, paperProps = {}, containerProps = {} }) {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: { xs: 2, md: 3 },
        px: { xs: 1, md: 2 },
        width: '100%',
        boxSizing: 'border-box',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...containerProps.sx,
      }}
      {...containerProps}
    >
      {paper ? (
        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            width: '100%',
            maxWidth: 900,
            mb: { xs: 3, md: 4 },
            borderRadius: 3,
            boxShadow: 2,
            ...paperProps.sx,
          }}
          {...paperProps}
        >
          {children}
        </Paper>
      ) : (
        children
      )}
    </Container>
  );
}

export default PageLayout; 