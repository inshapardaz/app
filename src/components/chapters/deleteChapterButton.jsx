import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Local Imports
import { libraryService } from '@/services';

const DeleteChapterButton = ({ chapter, onDeleted, disabled }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = useCallback(() => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'chapters.action.confirmDelete' }, { title: chapter.title }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => libraryService.deleteChapter(chapter)
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.deleted' }), { variant: 'success' }))
        .then(() => onDeleted && onDeleted())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.error.delete' }), { variant: 'error' })))
      .catch(() => {});
  }, [chapter, confirm]);

  if (chapter && chapter.links && chapter.links.delete) {
    return (
      <Tooltip title={<FormattedMessage id="action.delete" />}>
        <span>
          <IconButton onClick={onDelete} disabled={disabled}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return null;
};

DeleteChapterButton.defaultProps = {
  disabled: false,
  onDeleted: () => {},
};
DeleteChapterButton.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  }).isRequired,
  disabled: PropTypes.bool,
  onDeleted: PropTypes.func,
};

export default DeleteChapterButton;
