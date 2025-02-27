import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: [
      'Work Sans', 'sans-serif'
    ].join(','),
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      // main: '#F2C12E',
      main: '#fad253'
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
