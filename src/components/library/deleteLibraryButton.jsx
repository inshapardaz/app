import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';

// MUI
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Local Imports
import actions from '@/actions';

const DeleteLibraryButton = ({ library, onDeleted }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const [busy, setBusy] = useState(false);

  const onDelete = useCallback(() => {
    setBusy(true);
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'library.action.confirmDelete' }, { name: library.name }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => dispatch(actions.deleteLibrary(library, confirm)))
      .then(() => setBusy(false))
      .then(() => { if (onDeleted) onDeleted(); })
      .catch(() => {});
  }, [library, confirm]);

  if (library && library.links && library.links.delete) {
    return (
      <Tooltip title={<FormattedMessage id="action.delete" />}>
        <IconButton
          disabled={library === null}
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

export default DeleteLibraryButton;
