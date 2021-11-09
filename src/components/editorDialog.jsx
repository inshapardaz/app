import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const EditorDialog = ({
  show, busy, title, onCancelled, children,
}) => (
  <Dialog
    fullScreen
    open={show}
    onClose={() => onCancelled()}
    TransitionComponent={Transition}
    disableEscapeKeyDown={busy}
  >
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => onCancelled()}
          disabled={busy}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: (theme) => theme.spacing(2), flex: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
    <DialogContent>
      <Container maxWidth="lg">
        {children}
      </Container>
    </DialogContent>
  </Dialog>
);

EditorDialog.defaultProps = {
  show: false,
  busy: false,
  title: null,
  onCancelled: () => {},
  children: null,
};

EditorDialog.propTypes = {
  show: PropTypes.bool,
  busy: PropTypes.bool,
  title: PropTypes.node,
  onCancelled: PropTypes.func,
  children: PropTypes.node,
};

export default EditorDialog;
