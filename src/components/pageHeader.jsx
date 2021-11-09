import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PageHeader = ({ title, subTitle }) => (
  <>
    <Box sx={{
      backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0) 80%, rgba(255,255,255,1)), url("/images/banner_bkg.png")',
      padding: (theme) => theme.spacing(6),
    }}
    >
      <Typography variant="h4">
        { title }
      </Typography>
      <Typography variant="h6">
        { subTitle }
      </Typography>
    </Box>
  </>
);

PageHeader.defaultProps = {
  title: null,
  subTitle: null,
};

PageHeader.propTypes = {
  title: PropTypes.node,
  subTitle: PropTypes.node,
};

export default PageHeader;
