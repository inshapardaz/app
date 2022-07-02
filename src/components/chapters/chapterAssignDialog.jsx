import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Local import
import { libraryService } from '@/services';
import WritersDropDown from '@/components/account/writersDropdown';

const ChapterAssignDialog = ({
  chapter, onUpdated, onClose, open,
}) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [busy, setBusy] = useState(false);
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const onAssign = useCallback(() => {
    if (chapter !== null && chapter !== undefined && chapter.links.assign) {
      setBusy(true);
      libraryService.post(chapter.links.assign, selectedAccount && selectedAccount.id ? { AccountId: selectedAccount.id } : {})
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.assigned' }), { variant: 'success' }))
        .then(() => setBusy(false))
        .then(() => onUpdated())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.assigned' }), { variant: 'error' }));
    }
  }, [chapter, selectedAccount]);

  const onSelected = (value) => {
    setSelectedAccount(value);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle><FormattedMessage id="chapter.action.assignToUser" /></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id="chapter.assignedTo.description" values={{ title: chapter.title }} />
          </DialogContentText>
          <WritersDropDown
            fullWidth
            showNone
            onWriterSelected={onSelected}
            noneTitle={intl.formatMessage({ id: 'chapter.action.unassigned' })}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={onAssign}><FormattedMessage id="pages.assignToUser" /></Button>
          <Button disabled={busy} onClick={onClose}><FormattedMessage id="action.close" /></Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ChapterAssignDialog.defaultProps = {
  chapter: null,
  onUpdated: () => {},
  onClose: () => {},
};

ChapterAssignDialog.propTypes = {
  chapter: PropTypes.shape({
    title: PropTypes.string,
    chapterNumber: PropTypes.number,
    links: PropTypes.shape({
      assign: PropTypes.string,
    }),
  }),
  onUpdated: PropTypes.func,
  onClose: PropTypes.func,
};

export default ChapterAssignDialog;
