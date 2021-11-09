import React from 'react';
import { Backdrop, Button, CircularProgress } from '@mui/material';

const SubmitButton = ({ busy, label }, props) => (
  <Button
    {...props}
    type="submit"
    fullWidth
    variant="contained"
    color="primary"
    disabled={busy}
  >
    {label}

    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
      open={busy}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  </Button>
);

export default SubmitButton;
