import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

// Local Imports
import { libraryService } from '@/services/';

const ChapterEditor = ({ createLink, onUpdated, newChapterIndex }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState('');

  const onSave = () => {
    setBusy(true);
    libraryService.createChapter(createLink, { title: value, chapterNumber: newChapterIndex })
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' }))
      .then(() => onUpdated && onUpdated())
      .then(() => setValue(''))
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapters.messages.error.saving' }), { variant: 'error' }))
      .finally(() => setBusy(false));
  };

  const keyPress = (e) => {
    if (e !== null && e.keyCode === 13) {
      onSave();
    }
  };

  return (
    <ListItem
      key="new-chapter"
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
          onChange={(e) => e !== null && setValue(e.target.value)}
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

ChapterEditor.defaultProps = {
  chapter: null,
  createLink: '',
  onUpdated: () => {},
  newChapterIndex: 0,
};

ChapterEditor.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    bookId: PropTypes.number,
  }),
  createLink: PropTypes.string,
  onUpdated: PropTypes.func,
  newChapterIndex: PropTypes.number,
};

export default ChapterEditor;
