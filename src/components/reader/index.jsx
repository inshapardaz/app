import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';

// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Local Imports
import Reader from '@/components/reader/reader';
import FontMenu from '@/components/fontMenu';
import ButtonWithTooltip from '@/components/buttonWithTooltip';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';
import ChaptersSelector from '@/components/reader/chaptersSelector';
import ThemeSelector from '@/components/reader/themeSelector';
import LineHeightSelector from '@/components/reader/lineHeightSelector';

const ReaderFontSizeStorageKey = 'reader.fontSize';
const ReaderFontStorageKey = 'reader.font';
const MinimumFontScale = 0;
const MaximumFontScale = 5;

const BookTitle = ({ book }) => {
  if (!book) return null;
  return (
    <Link
      underline="hover"
      color="inherit"
      style={{ display: 'flex', alignItems: 'center', marginRight: (theme) => theme.spacing(1) }}
      to={`/books/${book.id}`}
    >
      <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
      {book && book.title}
    </Link>
  );
};

BookTitle.defaultProps = {
  book: null,
};

BookTitle.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
};

// ----------------------------------------------------------

const ReaderView = ({
  book, selectedChapter, data, format = 'text',
}) => {
  const history = useHistory();
  const [font, setFont] = useState(localStorage.getItem(ReaderFontStorageKey) || 'MehrNastaleeq');
  const [fontScale, setFontScale] = useState(parseFloat(localStorage.getItem(ReaderFontSizeStorageKey) || '1.0', 10));
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedLineHeight, setSelectedLineHeight] = useState(1.0);

  const onZoomInText = () => {
    if (parseFloat(fontScale) < MaximumFontScale) {
      const newScale = (parseFloat(fontScale) + 0.1).toFixed(2);
      setFontScale(newScale);
      localStorage.setItem(ReaderFontSizeStorageKey, newScale);
    }
  };

  const onZoomOutText = () => {
    if (parseFloat(fontScale) > MinimumFontScale) {
      const newScale = (parseFloat(fontScale) - 0.1).toFixed(2);
      setFontScale(newScale);
      localStorage.setItem(ReaderFontSizeStorageKey, newScale);
    }
  };

  const onFullScreenToggle = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <Box sx={{
      backgroundColor: (theme) => (selectedTheme ? selectedTheme.backgroundColor : theme.palette.background.paper),
      position: (fullScreen ? 'absolute' : 'block'),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: (theme) => (fullScreen ? theme.zIndex.appBar + 10 : 'inherit'),
    }}
    >
      <AppBar position="static" color="transparent" elevation={0} variant="outlined">
        <Toolbar variant="dense">
          <BookTitle book={book} />
          <BreadcrumbSeparator />
          <ChaptersSelector book={book} selectedChapter={selectedChapter} />
          <Divider orientation="vertical" sx={{ flex: 1 }} />
          <ThemeSelector onThemeChanged={setSelectedTheme} />
          <LineHeightSelector onValueChanged={setSelectedLineHeight} />
          <FontMenu size="small" variant="text" value={font} onFontSelected={setFont} storageKey={ReaderFontStorageKey} />
          <ButtonWithTooltip size="small" variant="text" tooltip={<FormattedMessage id="action.zoom.in" />} onClick={onZoomInText} disabled={parseFloat(fontScale) >= MaximumFontScale}>
            <ZoomInIcon fontSize="small" />
          </ButtonWithTooltip>
          <ButtonWithTooltip size="small" variant="text" tooltip={<FormattedMessage id="action.zoom.out" />} onClick={onZoomOutText} disabled={parseFloat(fontScale) <= MinimumFontScale}>
            <ZoomOutIcon fontSize="small" />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            tooltip={<FormattedMessage id={fullScreen ? 'chapter.toolbar.exitFullScreen' : 'chapter.toolbar.fullScreen'} />}
            onClick={onFullScreenToggle}
            variant="text"
            size="small"
          >
            {fullScreen ? <FullscreenExitIcon />
              : <FullscreenIcon fontSize="small" /> }
          </ButtonWithTooltip>
        </Toolbar>
      </AppBar>
      <Reader
        data={data}
        format={format}
        font={font}
        fontScale={fontScale}
        theme={selectedTheme}
        lineHeight={selectedLineHeight}
        height={fullScreen ? 'calc(100vh - 65px)' : 'calc(100vh - 113px)'}
        canGoBack={Boolean(selectedChapter && selectedChapter.links.previous)}
        onBack={() => history.push(`/books/${book.id}/chapters/${selectedChapter.chapterNumber - 1}`)}
        canGoForward={Boolean(selectedChapter && selectedChapter.links.next)}
        onForward={() => history.push(`/books/${book.id}/chapters/${selectedChapter.chapterNumber + 1}`)}
      />
    </Box>
  );
};

ReaderView.defaultProps = {
  book: null,
  selectedChapter: null,
  data: '',
  format: 'text',
};

ReaderView.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
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
};

export default ReaderView;
