import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/joy';

export function PageHeading({ children }: { children: ReactNode }) {
  return (
    <Typography level="h2" sx={{ color: '#fff', mb: '20px' }}>
      {children}
    </Typography>
  );
}

export function PageContent({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}
    >
      {children}
    </Box>
  );
}
