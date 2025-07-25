import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5A0058', // koyu mor - ana renk
      light: '#7A4A7A',
      dark: '#4A0047',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8B5A8B', // orta mor - ikincil renk
      light: '#A67BA6',
      dark: '#6B4A6B',
      contrastText: '#fff',
    },
    accent: {
      main: '#667eea', // mavi - vurgu rengi
      light: '#8BA3F0',
      dark: '#5A6FD8',
      contrastText: '#fff',
    },
    category: {
      main: '#87CEEB', // açık mavi - kategori rengi
      light: '#A8DDF0',
      dark: '#6BB8D8',
      contrastText: '#333',
    },
    background: {
      default: '#F3EDE7', // kahverenginin en açık tonu
      paper: '#F5F5F0',
    },
    text: {
      primary: '#3E2723',
      secondary: '#7a7a7a',
    },
    error: {
      main: '#E74C3C',
    },
    warning: {
      main: '#F39C12',
    },
    info: {
      main: '#667eea', // mavi tonu
      light: '#8BA3F0',
      dark: '#5A6FD8',
      contrastText: '#fff',
    },
    success: {
      main: '#27AE60',
    },
  },
  typography: {
    fontFamily: 'Quicksand, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            transition: 'transform 0.2s ease-in-out',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transition: 'box-shadow 0.3s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

// Yeni tema renkleri
export const themeColors = {
  primary: '#5A0058',
  secondary: '#8B5A8B',
  accent: '#667eea',
  category: '#87CEEB',
  sage: '#728C5A'
};

// Eski sage rengi (geriye uyumluluk için)
export const sageColor = '#728C5A';

export default theme;
