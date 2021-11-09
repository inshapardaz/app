import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Empty = ({
  items, message, children,
}) => {
  if (items == null || items.length < 1) {
    return (
      <Container maxWidth="sm" sx={{ mt: (theme) => theme.spacing(8) }}>
        <Box
          sx={{
            flexWrap: 'wrap',
            '& > :not(style)': {
              m: 1,
            },
          }}
        >
          <Paper elevation={0} sx={{ padding: (theme) => theme.spacing(8) }}>
            <Typography
              variant="h5"
              component="div"
              align="center"
              gutterBottom
              sx={{ color: (theme) => theme.palette.grey[700], pb: (theme) => theme.spacing(2) }}
            >
              {message}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return children;
};

Empty.defaultProps = {
  children: null,
  items: null,
};

Empty.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array,
  message: PropTypes.node.isRequired,
  children: PropTypes.node,
};

export default Empty;
