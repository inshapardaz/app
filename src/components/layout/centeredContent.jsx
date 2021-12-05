import React from 'react';
import Container from '@mui/material/Container';

const CenteredContent = ({ children }) => (
  <Container
    maxWidth="lg"
    sx={{
      mt: (theme) => theme.spacing(1),
      minHeight: 'calc(100vh - 133px)',
    }}
  >
    {children}
  </Container>
);

export default CenteredContent;
