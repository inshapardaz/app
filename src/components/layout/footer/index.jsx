import React from 'react';
import { FormattedMessage } from 'react-intl';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const Footer = () => (
  <>
    <Divider sx={{ mb: (theme) => theme.spacing(2) }} />

    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      data-ft="copyrights"
      sx={{
        margin: (theme) => theme.spacing(2),
      }}
    >
      <FormattedMessage id="footer.copyrights" />
    </Typography>
  </>
);

export default Footer;
