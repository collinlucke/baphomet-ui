import { ThemeProvider as EmotionThemeProvider, Theme } from '@emotion/react';
import { ReactNode } from 'react';

type ThemeProviderTypes = {
  theme?: Theme;
  children?: ReactNode;
};
const BaphThemeProvider = ({ theme, children }: ThemeProviderTypes) => {
  return (
    <EmotionThemeProvider theme={theme || {}}>{children}</EmotionThemeProvider>
  );
};

export default BaphThemeProvider;
