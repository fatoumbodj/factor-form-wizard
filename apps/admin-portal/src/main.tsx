import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {theme} from '@leasing/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient()

root.render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
       <QueryClientProvider client={queryClient}>
         <App />
          <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
