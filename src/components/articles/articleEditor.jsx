import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';

// Local import
import { libraryService } from '@/services/';

const ArticleEditor = ({ createLink, onUpdated }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState('');

  const onSave = () => {
    setBusy(true);
    libraryService.createArticle(createLink, { title: value })
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' }))
      .then(() => onUpdated && onUpdated())
      .then(() => setValue(''))
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapters.messages.error.saving' }), { variant: 'error' }))
      .finally(() => setBusy(false));
  };

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      onSave();
    }
  };

  return (
    <ListItem
      key="new-article"
      divider
      secondaryAction={(
        <>
          <Tooltip title={<FormattedMessage id="action.save" />}>
            <span><IconButton disabled={(busy || value === null || value.trim() === '')} onClick={onSave}><SaveOutlinedIcon /></IconButton></span>
          </Tooltip>
        </>
)}
    >
      <ListItemIcon>
        <AddCircleOutlineIcon />
      </ListItemIcon>
      <ListItemText primary={(
        <Input
          fullWidth
          disabled={busy}
          variant="standard"
          placeholder={intl.formatMessage({ id: 'chapter.messages.addName' })}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={keyPress}
          endAdornment={value && value.trim() !== '' ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear text"
                onClick={() => setValue('')}
                onMouseDown={() => setValue('')}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : ''}
        />
)}
      />
    </ListItem>
  );
};

ArticleEditor.defaultProps = {
  article: null,
  createLink: '',
  onUpdated: () => {},
};

ArticleEditor.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    sequenceNumber: PropTypes.number,
  }),
  createLink: PropTypes.string,
  onUpdated: PropTypes.func,
};

export default ArticleEditor;
