/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Local Imports
import { libraryService } from '@/services';
import EditorDialog from '@/components/editorDialog';
import WritersDropDown from '@/components/account/writersDropdown';
import AssignList, { ProcessingStatus } from '@/components/pages/processingStatusIcon';

const AssignmentDialog = ({
  onClose, open, pages, onAssigned,
}) => {
  const [busy, setBusy] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pagesStatus, setPagesStatus] = useState([]);

  useEffect(() => {
    setSelectedAccount(null);
    if (pages) {
      setPagesStatus(pages
        .map((p) => ({
          sequenceNumber: p.sequenceNumber,
          assignStatus: ProcessingStatus.Pending,
          accountId: p.accountId,
          accountName: p.accountName,
        })));
    }
  }, [pages]);

  const handleClose = () => {
    if (pagesStatus.filter((x) => x.assignStatus === ProcessingStatus.Complete).length > 0 && onAssigned) {
      onAssigned();
    }
    onClose();
  };

  const setPageStatus = (page, status) => {
    const newPages = pagesStatus.map((p) => {
      if (p.sequenceNumber === page.sequenceNumber) {
        p.assignStatus = status;
      }

      return p;
    });

    setPagesStatus(newPages);
  };

  const handleSubmit = () => {
    const promises = [];
    setBusy(true);
    pages.map((page) => {
      if (page !== null && page !== undefined) {
        if (page.links.assign) {
          setPageStatus(page, ProcessingStatus.Pending);
          return promises.push(libraryService.post(page.links.assign, { AccountId: selectedAccount.id })
            .then(() => setPageStatus(page, ProcessingStatus.Complete))
            .catch(() => setPageStatus(page, ProcessingStatus.Error)));
        }

        setPageStatus(page, ProcessingStatus.Skipped);
      }

      return Promise.resolve();
    });

    Promise.all(promises)
      .then(() => setBusy(false))
      .then(() => {
        if (pagesStatus.filter((p) => p.ocrStatus === 'error').length === 0) {
          handleClose();
        }
      });
  };

  const hasProcessablePages = pagesStatus.filter((x) => x.assignStatus === ProcessingStatus.Error || x.assignStatus === ProcessingStatus.Pending).length > 0;

  return (
    <EditorDialog
      show={open}
      busy={busy}
      title={<FormattedMessage id="pages.assignToUser" />}
      onCancelled={handleClose}
    >
      <WritersDropDown onWriterSelected={(value) => setSelectedAccount(value)} fullWidth />
      <AssignList pages={pagesStatus} fullWidth />
      <Button
        aria-controls="get-text"
        aria-haspopup="false"
        onClick={handleSubmit}
        disabled={!selectedAccount || !hasProcessablePages}
        startIcon={<PersonAddIcon />}
        fullWidth
        variant="contained"
        color="primary"
      >
        <FormattedMessage id="pages.assignToUser" />
      </Button>
    </EditorDialog>
  );
};

AssignmentDialog.defaultProps = {
  pages: [],
  onAssigned: () => {},
};

AssignmentDialog.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    assignStatus: PropTypes.string,
  })),
  onAssigned: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default AssignmentDialog;
