import React from 'react';
import Container from '@mui/material/Container';

const CenteredContent = ({ children }) => (
  <Container
    maxWidth="lg"
    sx={{
      minHeight: 'calc(100vh - 133px)',
    }}
  >
    {children}
  </Container>
);

export default CenteredContent;
