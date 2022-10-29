import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// MUI
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

// Local Imports
import { libraryService } from '@/services';

const DeleteChapterButton = ({
  chapter, onDeleted, disabled, menuItem = true,
}) => {
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
    if (menuItem) {
      return (
        <MenuItem onClick={onDelete} disabled={disabled}>
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="action.delete" />
          </ListItemText>
        </MenuItem>
      );
    }

    return (
      <ButtonWithTooltip tooltip={<FormattedMessage id="action.delete" />} onClick={onDelete} disabled={disabled} iconButton>
        <DeleteOutlineOutlinedIcon />
      </ButtonWithTooltip>
    );
  }

  return null;
};

DeleteChapterButton.defaultProps = {
  disabled: false,
  menuItem: true,
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
  menuItem: PropTypes.bool,
};

export default DeleteChapterButton;
