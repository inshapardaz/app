import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';

// MUI
import useMediaQuery from '@mui/material/useMediaQuery';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ClearIcon from '@mui/icons-material/Clear';
import FontDownloadIcon from '@mui/icons-material/FontDownload';

// Local Imports
import Reader from '@/components/reader/reader';
import FontSelector from '@/components/reader/fontSelector';
import ChaptersSelector from '@/components/reader/chaptersSelector';
import ThemeSelector from '@/components/reader/themeSelector';
import LineHeightSelector from '@/components/reader/lineHeightSelector';

const ReaderFontSizeStorageKey = 'reader.fontSize';
const ReaderViewTypeStorageKey = 'reader.viewType';
const MinimumFontScale = 0;
const MaximumFontScale = 5;

const ReaderView = ({
  book, selectedChapter, data, format = 'text', busy,
}) => {
  const history = useHistory();
  const intl = useIntl();
  const [fontScale] = useLocalStorage(ReaderFontSizeStorageKey, 1.0);
  const [view] = useLocalStorage(ReaderViewTypeStorageKey, 'single');
  const [fullScreen, setFullScreen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [showLineHeightSelector, setShowLineHeightSelector] = useState(false);
  const isNarrowScreen = useMediaQuery('(max-width:1300px)');

  const onZoomInText = () => {
    if (fontScale < MaximumFontScale) {
      const newScale = (parseFloat(fontScale) + 0.1).toFixed(2);
      writeStorage(ReaderFontSizeStorageKey, newScale);
    }
  };

  const onZoomOutText = () => {
    if (fontScale > MinimumFontScale) {
      const newScale = (parseFloat(fontScale) - 0.1).toFixed(2);
      writeStorage(ReaderFontSizeStorageKey, newScale);
    }
  };

  const onFullScreenToggle = () => {
    setFullScreen(!fullScreen);
  };

  const onViewTypeChanged = (newViewType) => {
    writeStorage(ReaderViewTypeStorageKey, newViewType);
  };

  const renderColumnLayout = () => {
    if (isNarrowScreen) return null;
    if (view === 'single') {
      return (
        <SpeedDialAction
          key="multi-page-view"
          icon={<ImportContactsIcon />}
          tooltipTitle={intl.formatMessage({ id: 'reader.twoPages' })}
          onClick={() => onViewTypeChanged('two')}
        />
      );
    }

    return (
      <SpeedDialAction
        key="single-page-view"
        icon={<ArticleOutlinedIcon />}
        tooltipTitle={intl.formatMessage({ id: 'reader.singlePage' })}
        onClick={() => onViewTypeChanged('single')}
      />
    );
  };

  return (
    <>
      <ChaptersSelector book={book} selectedChapter={selectedChapter} open={showDrawer} onCloseDrawer={() => setShowDrawer(false)} />
      <LineHeightSelector open={showLineHeightSelector} onClose={() => setShowLineHeightSelector(false)} />
      <ThemeSelector open={showThemeSelector} onClose={() => setShowThemeSelector(false)} />
      <FontSelector open={showFontSelector} onClose={() => setShowFontSelector(false)} />
      <Backdrop open={busy} />
      <SpeedDial
        ariaLabel="settings"
        sx={{
          position: 'absolute', bottom: 16, right: 16, zIndex: (theme) => theme.zIndex.appBar + 10,
        }}
        icon={<SpeedDialIcon icon={<SettingsIcon />} openIcon={<ClearIcon />} />}
      >
        <SpeedDialAction
          key="full-screen"
          icon={fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          tooltipTitle={intl.formatMessage({ id: fullScreen ? 'chapter.toolbar.exitFullScreen' : 'chapter.toolbar.fullScreen' })}
          onClick={onFullScreenToggle}
        />
        <SpeedDialAction
          key="zoom-out"
          icon={<ZoomOutIcon />}
          tooltipTitle={intl.formatMessage({ id: 'action.zoom.out' })}
          onClick={onZoomOutText}
        />
        <SpeedDialAction
          key="zoom-in"
          icon={<ZoomInIcon />}
          tooltipTitle={intl.formatMessage({ id: 'action.zoom.in' })}
          onClick={onZoomInText}
        />
        {renderColumnLayout()}

        <SpeedDialAction
          key="line-height"
          icon={<FormatLineSpacingIcon />}
          tooltipTitle={intl.formatMessage({ id: 'lineHeight' })}
          onClick={() => setShowLineHeightSelector(true)}
        />

        <SpeedDialAction
          key="themes"
          icon={<ColorLensIcon />}
          tooltipTitle={intl.formatMessage({ id: 'theme' })}
          onClick={() => setShowThemeSelector(true)}
        />

        <SpeedDialAction
          key="font"
          icon={<FontDownloadIcon />}
          tooltipTitle={intl.formatMessage({ id: 'chapter.toolbar.font' })}
          onClick={() => setShowFontSelector(true)}
        />
      </SpeedDial>
      <Reader
        data={data}
        format={format}
        book={book}
        chapter={selectedChapter}
        view={view}
        fullScreen={fullScreen}
        canGoBack={Boolean(selectedChapter && selectedChapter.links.previous)}
        onBack={() => history.push(`/books/${book.id}/chapters/${selectedChapter.chapterNumber - 1}`)}
        canGoForward={Boolean(selectedChapter && selectedChapter.links.next)}
        onForward={() => history.push(`/books/${book.id}/chapters/${selectedChapter.chapterNumber + 1}`)}
        onChapterClicked={() => setShowDrawer(true)}
      />
    </>
  );
};

ReaderView.defaultProps = {
  book: null,
  selectedChapter: null,
  data: '',
  format: 'text',
  busy: false,
};

ReaderView.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  selectedChapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    chapterNumber: PropTypes.number,
    links: PropTypes.shape({
      previous: PropTypes.string,
      next: PropTypes.string,
    }),
  }),
  data: PropTypes.string,
  format: PropTypes.string,
  busy: PropTypes.bool,
};

export default ReaderView;
