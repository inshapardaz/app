import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

// MUI
import { green, red } from '@mui/material/colors';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import FindInPageIcon from '@mui/icons-material/FindInPage';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Local imports
import { libraryService } from '@/services';
import ButtonWithTooltip from '@/components/buttonWithTooltip';
import EditorDialog from '@/components/editorDialog';

const getOcrStatusIcon = (status) => {
  if (status === 'pending') {
    return (<ScheduleIcon />);
  }
  if (status === 'processing') {
    return (<HourglassEmptyIcon />);
  }
  if (status === 'complete') {
    return (<CheckCircleOutlineIcon style={{ color: green[500] }} />);
  }
  if (status === 'error') {
    return (<ErrorOutlineIcon style={{ color: red[500] }} />);
  }

  return null;
};

const OcrGrid = ({ pages }) => (
  <TableContainer>
    <Table>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.sequenceNumber}>
            <TableCell component="th" scope="row">
              {page.sequenceNumber}
            </TableCell>
            <TableCell align="right">{getOcrStatusIcon(page.ocrStatus)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

OcrGrid.defaultProps = {
  pages: null,
};

OcrGrid.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    ocrStatus: PropTypes.string,
  })),
};

const OcrDialog = ({ onClose, open, pages }) => {
  const intl = useIntl();
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [storeApiKey, setStoreApiKey] = useState(false);
  const [pagesStatus, setPagesStatus] = useState([]);

  useEffect(() => {
    const ocrKey = localStorage.getItem('ocr.key');
    if (ocrKey && ocrKey.length > 0) {
      setKey(ocrKey);
      setStoreApiKey(true);
    }
    if (pages) {
      setPagesStatus(pages.map((p) => ({ sequenceNumber: p.sequenceNumber, ocrStatus: 'pending' })));
    }
  }, [pages]);

  const handleClose = () => {
    if (!storeApiKey) setKey('');
    onClose(pagesStatus.filter((p) => p.ocrStatus === 'complete').length > 0);
  };

  const setPageStatus = (page, status) => {
    const newPages = pagesStatus.map((p) => {
      if (p.sequenceNumber === page.sequenceNumber) {
        p.ocrStatus = status;
      }

      return p;
    });

    setPagesStatus(newPages);
  };

  const handleSubmit = () => {
    const promises = [];
    setBusy(true);
    pages.map((page) => {
      if (page !== null && page !== undefined && page.ocrStatus !== 'complete') {
        if (page.links.ocr) {
          setPageStatus(page, 'processing');
          return promises.push(libraryService.post(page.links.ocr, key)
            .then(() => setPageStatus(page, 'complete'))
            .catch(() => setPageStatus(page, 'error')));
        }
      } else {
        setPageStatus(page, 'skipped');
      }

      return Promise.resolve();
    });

    Promise.all(promises)
      .then(() => setBusy(false))
      .then(() => {
        if (storeApiKey) {
          localStorage.setItem('ocr.key', key);
        } else {
          localStorage.removeItem('ocr.key');
        }

        if (pagesStatus.filter((p) => p.ocrStatus === 'error').length === 0) {
          handleClose();
        }
      })
      .catch((e) => console.error(e));
  };

  const hasProcessablePages = pagesStatus.filter((x) => x.ocrStatus === 'error' || x.ocrStatus === 'pending').length > 0;

  return (
    <EditorDialog
      show={open}
      busy={busy}
      title={<FormattedMessage id="pages.ocr" />}
      onCancelled={handleClose}
    >
      <Typography>
        <FormattedMessage id="pages.ocr.description" />
      </Typography>
      <TextField
        autoFocus
        margin="dense"
        id="key"
        value={key}
        onChange={(event) => setKey(event.target.value)}
        label={intl.formatMessage({ id: 'pages.ocr.title' })}
        fullWidth
      />
      <FormControlLabel
        control={(
          <Checkbox
            checked={storeApiKey}
            onChange={(event) => setStoreApiKey(event.target.checked)}
          />
   )}
        label={<FormattedMessage id="pages.ocr.storeLocal" />}
      />
      <OcrGrid pages={pagesStatus} />
      <Button
        aria-controls="get-text"
        aria-haspopup="false"
        onClick={handleSubmit}
        disabled={!key || !hasProcessablePages}
        startIcon={<FindInPageIcon />}
        fullWidth
        variant="contained"
        color="primary"
      >
        <FormattedMessage id="pages.ocr" />
      </Button>
    </EditorDialog>
  );
};

OcrDialog.defaultProps = {
  pages: null,
};
OcrDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    ocrStatus: PropTypes.string,
  })),
};

const PageOcrButton = ({ pages, onUpdated }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (completed = false) => {
    if (completed) {
      onUpdated();
    }
    setOpen(false);
  };

  return (
    <>
      <ButtonWithTooltip
        variant="outlined"
        tooltip={<FormattedMessage id="pages.ocr" />}
        disabled={pages.length < 1}
        onClick={handleClickOpen}
      >
        <FindInPageIcon />
      </ButtonWithTooltip>
      <OcrDialog open={open} onClose={handleClose} pages={pages} />
    </>
  );
};

PageOcrButton.defaultProps = {
  pages: null,
  onUpdated: () => {},
};
PageOcrButton.propTypes = {
  onUpdated: PropTypes.func,
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
  })),
};
export default PageOcrButton;
