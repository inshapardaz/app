import React from 'react';
import Container from '@mui/material/Container';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const BoxedLayout = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          minHeight: 'calc(100vh - 133px)',
        }}
      >
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default BoxedLayout;
