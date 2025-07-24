import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4E342E', // daha koyu kahverengi
      light: '#7B5E57',
      dark: '#260e04',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8D6E63', // daha koyu açık kahverengi
      light: '#BCAAA4',
      dark: '#5f4339',
      contrastText: '#fff',
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
      main: '#8D6E63', // kahverengi tonu
      light: '#BCAAA4',
      dark: '#5f4339',
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

// Sage rengi: #728C5A
export const sageColor = '#728C5A';

export default theme;
