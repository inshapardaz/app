import React from 'react';

// MUI
import Box from '@mui/material/Box';

// Local Imports
import Header from '@/components/layout/header';

const NoFooterLayout = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <Box sx={{
        minHeight: 'calc(100vh - 133px)',
      }}
      >
        {children}
      </Box>
    </>
  );
};

export default NoFooterLayout;
