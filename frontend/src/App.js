import { ThemeProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';
import UrlPaths from './router';
import darkTheme from './theme/darkTheme';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider>
        <CssBaseline />
        <UrlPaths />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
