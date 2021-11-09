import React from 'react';

// MUI
import Grid from '@mui/material/Grid';

const PageImage = () => (
  <Grid
    item
    xs={false}
    sm={4}
    md={7}
    sx={{
      backgroundImage: 'url(https://source.unsplash.com/1600x900/?library,books)',
      backgroundRepeat: 'no-repeat',
      backgroundColor: (theme) => (theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900]),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />
);

export default PageImage;
