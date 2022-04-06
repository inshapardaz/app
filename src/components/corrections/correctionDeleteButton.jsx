import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useIntl, FormattedMessage } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

// Local Imports
import { toolsService } from '@/services';

const CorrectionDeleteButton = ({ correction, onDeleted }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = useCallback(() => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'correction.action.confirmDelete' }, { incorrectText: correction.incorrectText }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => toolsService.deleteCorrection(correction)
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'corrections.messages.deleted' }), { variant: 'success' }))
        .then(() => onDeleted && onDeleted())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'corrections.messages.error.delete' }), { variant: 'error' })))
      .catch(() => {});
  }, [correction, confirm]);

  if (correction && correction.links && correction.links.delete) {
    return (
      <Tooltip title={<FormattedMessage id="action.delete" />}>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

CorrectionDeleteButton.propTypes = {
  correction: PropTypes.shape({
    language: PropTypes.string,
    profile: PropTypes.string,
    incorrectText: PropTypes.string,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  }).isRequired,
  onDeleted: PropTypes.func.isRequired,
};

export default CorrectionDeleteButton;
