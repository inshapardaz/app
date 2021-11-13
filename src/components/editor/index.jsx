import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import MUIEditor, { MUIEditorState } from 'urdu-editor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

// MUI
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

import SaveIcon from '@mui/icons-material/Save';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

// Local Imports
import FontMenu from '@/components/fontMenu';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const Editor = ({
  identifier, content, label, onSave, onDirty,
  startToolbarButtons, message,
  allowFullScreen, editorHeight = '100%',
}) => {
  const [font, setFont] = useState(localStorage.getItem('editor-font') || null);
  const [textScale, setTextScale] = useState(localStorage.getItem('editor.fontSize') || 1.0);
  const [loadedSavedData, setLoadedSavedData] = useState(false);
  const [data, setData] = useState(content);
  const [fullScreen, setFullScreen] = useState(false);
  const [editorState, setEditorState] = React.useState(MUIEditorState.createEmpty());

  useEffect(() => {
    const savedData = localStorage.getItem(`contents-${identifier}`);
    let finalData = null;
    if (savedData) {
      finalData = savedData;
      setLoadedSavedData(true);
    } else {
      finalData = content;
      setLoadedSavedData(false);
    }

    setData(finalData);

    const rawData = markdownToDraft(finalData);
    const contentState = convertFromRaw(rawData);
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }, [identifier, content]);

  const onChange = (newState) => {
    setEditorState(newState);

    const currentContent = editorState.getCurrentContent();
    const rawObject = convertToRaw(currentContent);
    const markdownString = draftToMarkdown(rawObject);

    setData(markdownString);
    localStorage.setItem(`contents-${identifier}`, markdownString);
    onDirty(markdownString !== content);
  };

  const onZoomInText = () => {
    if (parseFloat(textScale) < 3.0) {
      const newScale = (parseFloat(textScale) + 0.1).toFixed(2);
      setTextScale(newScale);
      localStorage.setItem('editor.fontSize', newScale);
    }
  };

  const onZoomOutText = () => {
    if (parseFloat(textScale) > 1) {
      const newScale = (parseFloat(textScale) - 0.1).toFixed(2);
      setTextScale(newScale);
      localStorage.setItem('editor.fontSize', newScale);
    }
  };

  const onFullScreenToggle = () => {
    setFullScreen(!fullScreen);
  };

  const save = () => {
    onSave(data)
      .then(() => localStorage.removeItem(`contents-${identifier}`));
  };

  return (
    <Box sx={{
      backgroundColor: (theme) => theme.palette.background.paper,
      position: (fullScreen ? 'absolute' : 'block'),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: (theme) => (fullScreen ? theme.zIndex.appBar + 10 : 'inherit'),
    }}
    >
      {message}
      <Toolbar>
        {label}
        <Divider orientation="vertical" sx={{ paddingLeft: (theme) => theme.spacing(1) }} />
        <ButtonGroup>
          {startToolbarButtons}
          <ButtonWithTooltip tooltip={<FormattedMessage id="action.save" />} onClick={save}>
            <SaveIcon />
          </ButtonWithTooltip>
          <FontMenu value={font} onFontSelected={setFont} storageKey="editor-font" />
          <ButtonWithTooltip tooltip="ocr">
            <FindInPageIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip tooltip="auto correct">
            <AutoAwesomeIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip tooltip={<FormattedMessage id="action.zoom.in" />} onClick={onZoomInText} disabled={parseFloat(textScale) >= 3}>
            <ZoomInIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip tooltip={<FormattedMessage id="action.zoom.out" />} onClick={onZoomOutText} disabled={parseFloat(textScale) <= 1}>
            <ZoomOutIcon />
          </ButtonWithTooltip>
        </ButtonGroup>
        <Divider orientation="vertical" sx={{ flex: 1 }} />
        {allowFullScreen && (
        <>
          <Divider orientation="vertical" />
          <ButtonWithTooltip tooltip={<FormattedMessage id={fullScreen ? 'chapter.toolbar.exitFullScreen' : 'chapter.toolbar.fullScreen'} />} onClick={onFullScreenToggle} variant="outlined">
            {fullScreen ? <FullscreenExitIcon />
              : <FullscreenIcon /> }
          </ButtonWithTooltip>
        </>
        )}
      </Toolbar>

      <Box sx={{
        fontFamily: font,
        fontSize: `${textScale}em`,
        mx: (theme) => theme.spacing(3),
      }}
      >
        {loadedSavedData && (
        <Alert
          severity="info"
          action={(
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={() => {
                localStorage.removeItem(`contents-${identifier}`);
                setData(content);
                setLoadedSavedData(false);
              }}
            >
              <FormattedMessage id="page.messages.unsavedText.discardUnsavedChanges" />
            </Button>
  )}
        >
          <FormattedMessage id="page.messages.unsavedText.loaded" />
        </Alert>
        )}
        <MUIEditor editorState={editorState} onChange={onChange} />
      </Box>
    </Box>
  );
};

Editor.defaultProps = {
  label: '',
  content: '',
  startToolbarButtons: null,
  message: null,
  allowFullScreen: true,
  onSave: () => {},
  onDirty: () => {},
  editorHeight: '100%',
};

Editor.propTypes = {
  identifier: PropTypes.string.isRequired,
  label: PropTypes.node,
  content: PropTypes.string,
  startToolbarButtons: PropTypes.node,
  message: PropTypes.node,
  allowFullScreen: PropTypes.bool,
  onSave: PropTypes.func,
  onDirty: PropTypes.func,
  editorHeight: PropTypes.string,
};

export default Editor;
