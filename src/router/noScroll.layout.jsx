import React from 'react';

// MUI
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// Local Imports
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const NoScrollLayout = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <Box sx={{
        minHeight: 'calc(100vh - 133px)',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'row',
        alignContent: 'stretch',
      }}
      >
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default NoScrollLayout;
