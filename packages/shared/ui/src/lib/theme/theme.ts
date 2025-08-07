// src/theme.ts (extended theme)
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }

  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
        main: '#8c1aab',   
        light: '#e7d3ed',
        dark: '#5B21B6',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#FACC15',    
        light: '#FDE047', 
        dark: '#CA8A04',
        contrastText: '#000000'
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});
