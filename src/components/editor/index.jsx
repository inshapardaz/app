import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { stateToMarkdown } from 'draft-js-export-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';

import MUIEditor, { MUIEditorState, toolbarControlTypes, fileToBase64 } from 'urdu-editor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

// MUI
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
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
import BuildIcon from '@mui/icons-material/Build';

// Local Imports
import actions from '@/actions';
import FontMenu from '@/components/fontMenu';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const convertToMarkdown = (editorState) => stateToMarkdown(editorState.getCurrentContent());
const convertToDraftJs = (markdownData) => {
  const contentState = stateFromMarkdown(markdownData, { parserOptions: { atomicImages: true } });
  return EditorState.createWithContent(contentState);
};

const getReplaceAllRegex = (dict) => {
  let retVal = '';
  for (const key in dict) {
    retVal += `(${key})|`;
  }

  return new RegExp(`\\b${retVal.slice(0, -1)}\\b`, 'giu');
};

const Editor = ({
  identifier, content, label, onSave, onDirty,
  startToolbar, endToolbar, secondaryView, message,
  allowFullScreen, allowOcr,
}) => {
  const dispatch = useDispatch();
  const [font, setFont] = useState(localStorage.getItem('editor-font') || null);
  const [textScale, setTextScale] = useState(localStorage.getItem('editor.fontSize') || 1.0);
  const [loadedSavedData, setLoadedSavedData] = useState(false);
  const [showControls, setShowControls] = useState(localStorage.getItem('editor.showToolbar') ? localStorage.getItem('editor.showToolbar') === 'true' : true);
  const [fullScreen, setFullScreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorState, setEditorState] = React.useState(MUIEditorState.createEmpty());
  const language = useSelector((state) => state.localeReducer.language);
  const punctuationCorrections = useSelector((state) => state.toolsReducer.punctuationCorrections);
  const autoFixCorrections = useSelector((state) => state.toolsReducer.autoFixCorrections);

  const config = {
    lang: language,
    editor: {
      style: {
        flexGrow: 1,
        overflowX: 'auto',
      },
    },
    toolbar: {
      className: '',
      style: {},
      visible: showControls,
      controls: [
        toolbarControlTypes.undo,
        toolbarControlTypes.redo,
        toolbarControlTypes.divider,
        toolbarControlTypes.bold,
        toolbarControlTypes.italic,
        toolbarControlTypes.underline,
        toolbarControlTypes.strikethrough,
        toolbarControlTypes.divider,
        toolbarControlTypes.linkAdd,
        toolbarControlTypes.linkRemove,
        toolbarControlTypes.image,
        toolbarControlTypes.divider,
        toolbarControlTypes.blockType,
        toolbarControlTypes.unorderedList,
        toolbarControlTypes.orderedList,
      ],
      controlsConfig: {
        image: {
          uploadCallback: fileToBase64,
        },
      },
    },
  };

  useEffect(() => {
    if (saving) return;
    const savedData = window.localStorage.getItem(`contents-${identifier}`);
    if (savedData) {
      const rawContentFromStore = convertFromRaw(JSON.parse(savedData));
      setEditorState(EditorState.createWithContent(rawContentFromStore));
      setLoadedSavedData(true);
    } else {
      const newState = convertToDraftJs(content);
      setEditorState(newState);
      setLoadedSavedData(false);
    }
  }, [identifier, content]);

  useEffect(() => {
    console.log(`Loading corrections for ${language}`);
    dispatch(actions.getPunctuationCorrections(language));
    dispatch(actions.getAutoFixCorrections(language));
  }, []);

  const onChange = (newState) => {
    const currentContent = newState.getCurrentContent();
    const oldContent = editorState.getCurrentContent();

    if (oldContent !== currentContent) {
      const contentRaw = convertToRaw(currentContent);
      localStorage.setItem(`contents-${identifier}`, JSON.stringify(contentRaw));
      onDirty(true);
    }

    setEditorState(newState);
  };

  const save = () => {
    const markDown = convertToMarkdown(editorState);
    setSaving(true);
    onSave(markDown)
      .then(() => localStorage.removeItem(`contents-${identifier}`))
      .then(() => setLoadedSavedData(false))
      .then(() => onDirty(false))
      .finally(() => setSaving(false));
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

  const onControlsToggle = () => {
    localStorage.setItem('editor.showToolbar', !showControls);
    setShowControls(!showControls);
  };

  const onCorrect = () => {
    let markDown = convertToMarkdown(editorState);
    markDown = markDown.replace(/  +/g, ' ');

    for (const [key, value] of Object.entries(punctuationCorrections)) {
      markDown = markDown.replaceAll(key, value);
    }

    markDown = markDown.replace(getReplaceAllRegex(autoFixCorrections), (matched) => autoFixCorrections[matched]);

    const draftJs = convertToDraftJs(markDown);
    setEditorState(draftJs);
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
              setEditorState(convertToDraftJs(content));
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
      {message}
      <Toolbar>
        {label}
        <Divider orientation="vertical" sx={{ paddingLeft: (theme) => theme.spacing(1) }} />
        {startToolbar}
        <ButtonGroup>
          <ButtonWithTooltip tooltip={<FormattedMessage id="action.save" />} onClick={save}>
            <SaveIcon />
          </ButtonWithTooltip>
          <FontMenu value={font} onFontSelected={setFont} storageKey="editor-font" />
          {allowOcr && (
          <ButtonWithTooltip tooltip="ocr">
            <FindInPageIcon />
          </ButtonWithTooltip>
          )}
          <ButtonWithTooltip tooltip="auto correct" onClick={onCorrect}>
            <AutoAwesomeIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip tooltip={<FormattedMessage id="action.zoom.in" />} onClick={onZoomInText} disabled={parseFloat(textScale) >= 3}>
            <ZoomInIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip tooltip={<FormattedMessage id="action.zoom.out" />} onClick={onZoomOutText} disabled={parseFloat(textScale) <= 1}>
            <ZoomOutIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            tooltip={<FormattedMessage id={showControls ? 'textEditor.actions.hideEditControls' : 'textEditor.actions.showEditControls'} />}
            onClick={onControlsToggle}
          >
            <BuildIcon color={showControls ? '' : 'disabled'} />
          </ButtonWithTooltip>
        </ButtonGroup>
        <Divider orientation="vertical" sx={{ flex: 1 }} />
        {endToolbar}
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

      <Grid
        container
        alignItems="stretch"
        direction="row"
        wrap="nowrap"
        sx={{
          mt: '1px',
          mx: 0,
          height: fullScreen ? 'calc(100vh - 49px)' : 'calc(100vh - 182px)',
          justifyItems: 'stretch',
        }}
      >
        <Grid item md={secondaryView === null ? 12 : 6}>
          <Box sx={{
            fontFamily: font,
            fontSize: `${textScale}em`,
            mx: (theme) => theme.spacing(3),
            height: `calc(100vh - ${fullScreen ? '64px' : '181px'})`,
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            <MUIEditor editorState={editorState} onChange={onChange} config={config} />
          </Box>
        </Grid>
        {secondaryView !== null
          && (
          <Grid item sx={{ overflow: 'auto', flex: 1 }}>
            { secondaryView }
          </Grid>
          )}
      </Grid>
    </Box>
  );
};

Editor.defaultProps = {
  label: '',
  content: '',
  startToolbar: null,
  endToolbar: null,
  message: null,
  allowFullScreen: true,
  secondaryView: null,
  onSave: () => {},
  onDirty: () => {},
  allowOcr: true,
};

Editor.propTypes = {
  identifier: PropTypes.string.isRequired,
  label: PropTypes.node,
  content: PropTypes.string,
  startToolbar: PropTypes.node,
  endToolbar: PropTypes.node,
  message: PropTypes.node,
  allowFullScreen: PropTypes.bool,
  secondaryView: PropTypes.node,
  onSave: PropTypes.func,
  onDirty: PropTypes.func,
  allowOcr: PropTypes.bool,
};

export default Editor;
