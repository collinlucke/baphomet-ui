import type { ReactNode } from 'react';
import { Box, type BoxProps } from '@mui/joy';

const pageFont = "'Tajawal', Helvetica, Arial, sans-serif";

type PageShellProps = {
  children: ReactNode;
} & Omit<BoxProps, 'children'>;

export function PageShell({ children, sx, ...rest }: PageShellProps) {
  return (
    <Box
      {...rest}
      sx={[
        {
          flex: 1,
          width: '100%',
          minHeight: '100vh',
          boxSizing: 'border-box',
          backgroundColor: '#222',
          padding: '20px',
          color: '#f5f5f5',
          fontFamily: pageFont,
          '& , & *': {
            fontFamily: pageFont
          }
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {children}
    </Box>
  );
}
