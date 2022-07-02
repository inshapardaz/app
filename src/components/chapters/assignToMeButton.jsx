import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// Local Imports
import { libraryService } from '@/services';

const AssignToMeButton = ({ chapter, onAssigned, onAssigning }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);

  const onAssignToMe = useCallback(() => {
    if (chapter !== null && chapter !== undefined && chapter.links.assign) {
      setBusy(true);
      libraryService.post(chapter.links.assign, {})
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.assigned' }), { variant: 'success' }))
        .then(() => setBusy(false))
        .then(() => onAssigning(false))
        .then(() => onAssigned())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.assigned' }), { variant: 'error' }));
    }
  }, [chapter]);

  return (
    <MenuItem
      disabled={chapter === null || busy}
      onClick={onAssignToMe}
    >
      <ListItemIcon>
        <AssignmentIndIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id="chapter.assignedToMe.label" />
      </ListItemText>
    </MenuItem>
  );
};

AssignToMeButton.defaultProps = {
  chapter: null,
  onAssigned: () => {},
  onAssigning: () => {},
};

AssignToMeButton.propTypes = {
  chapter: PropTypes.shape({
    chapterNumber: PropTypes.number,
    links: PropTypes.shape({
      assign: PropTypes.string,
    }),
  }),
  onAssigned: PropTypes.func,
  onAssigning: PropTypes.func,
};

export default AssignToMeButton;
