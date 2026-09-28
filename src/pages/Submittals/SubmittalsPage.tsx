import { CssVarsProvider } from '@mui/joy/styles';
import {
  ThemeProvider,
  createTheme,
  THEME_ID as MATERIAL_THEME_ID
} from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { App } from './App';

const queryClient = new QueryClient();
const materialTheme = createTheme();

const SubmittalsPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <CssVarsProvider
          theme={theme}
          defaultMode="light"
          modeStorageKey="submittals-mode"
        >
          <App />
        </CssVarsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default SubmittalsPage;
