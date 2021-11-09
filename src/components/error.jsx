import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Error = ({
  error, message, actionText, onAction, children,
}) => {
  if (error) {
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
            { onAction && (
            <Button disableElevation fullWidth onClick={() => onAction && onAction()}>
              {actionText}
            </Button>
            )}
          </Paper>
        </Box>
      </Container>
    );
  }

  return children;
};

Error.defaultProps = {
  onAction: null,
  actionText: null,
  children: null,
};

Error.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  actionText: PropTypes.node,
  onAction: PropTypes.func,
  children: PropTypes.node,
};

export default Error;
