import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

// Local Imports
import actions from '@/actions';

const DeleteCategoryButton = ({ category }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const onDelete = useCallback(() => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'categories.action.confirmDelete' }, { name: category.name }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => dispatch(actions.deleteCategory(category, confirm)));
  }, [category, confirm]);

  if (category && category.links && category.links.delete) {
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

DeleteCategoryButton.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  }).isRequired,
};

export default DeleteCategoryButton;
