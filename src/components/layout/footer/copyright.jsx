import React from 'react';
import { FormattedMessage } from 'react-intl';

// MUI
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// Local Imports
import LanguageSelector from '@/components/language/languageSelector';

const Copyright = () => (
  <Grid container component="main" alignItems="center">
    <Grid item>
      <Typography variant="body2" color="textSecondary" align="center">
        <FormattedMessage id="footer.copyrights" />
      </Typography>
    </Grid>
    <Grid item>
      <LanguageSelector />
    </Grid>
  </Grid>
);

export default Copyright;
