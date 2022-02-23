import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';

// MUI
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import SettingsIcon from '@mui/icons-material/Settings';

// Local Imports
import Reader from '@/components/reader/reader';
import FontList from '@/components/fontList';
import ButtonWithTooltip from '@/components/buttonWithTooltip';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';
import ChaptersSelector from '@/components/reader/chaptersSelector';
import ThemeSelector, { getSelectedTheme } from '@/components/reader/themeSelector';
import LineHeightSelector from '@/components/reader/lineHeightSelector';
import { localeService } from '@/services/';

const ReaderFontSizeStorageKey = 'reader.fontSize';
const ReaderFontStorageKey = 'reader.font';
const ReaderViewTypeStorageKey = 'reader.viewType';
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
  const [fontScale, setFontScale] = useState(parseFloat(localStorage.getItem(ReaderFontSizeStorageKey) || '1.0'));
  const [view, setView] = useState(localStorage.getItem(ReaderViewTypeStorageKey) || 'single');
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(getSelectedTheme());
  const [selectedLineHeight, setSelectedLineHeight] = useState(parseFloat(localStorage.getItem('reader.lineHeight') || '1.0'));
  const [showDrawer, setShowDrawer] = useState(false);
  const isNarrowScreen = useMediaQuery('(max-width:1300px)');

  const onZoomInText = () => {
    if (fontScale < MaximumFontScale) {
      const newScale = (parseFloat(fontScale) + 0.1).toFixed(2);
      setFontScale(newScale);
      localStorage.setItem(ReaderFontSizeStorageKey, newScale);
    }
  };

  const onZoomOutText = () => {
    if (fontScale > MinimumFontScale) {
      const newScale = (parseFloat(fontScale) - 0.1).toFixed(2);
      setFontScale(newScale);
      localStorage.setItem(ReaderFontSizeStorageKey, newScale);
    }
  };

  const onFullScreenToggle = () => {
    setFullScreen(!fullScreen);
  };

  const onViewTypeChanged = (newViewType) => {
    localStorage.setItem(ReaderViewTypeStorageKey, newViewType);
    setView(newViewType);
  };

  const renderColumnLayout = () => {
    if (isNarrowScreen) return null;
    return (
      <>
        <ListItemButton onClick={() => onViewTypeChanged('single')} selected={view === 'single'}>
          <ListItemIcon>
            <ArticleOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="reader.singlePage" />} />
        </ListItemButton>

        <ListItemButton onClick={() => onViewTypeChanged('two')} selected={view === 'two'}>
          <ListItemIcon>
            <ImportContactsIcon />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="reader.twoPages" />} />
        </ListItemButton>
        <Divider />
      </>
    );
  };
  return (
    <Box sx={{
      backgroundColor: (theme) => (selectedTheme ? selectedTheme.backgroundColor : theme.palette.background.paper),
      position: (fullScreen ? 'absolute' : 'block'),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      direction: book && localeService.isRtl(book.language) ? 'rtl' : 'ltr',
      zIndex: (theme) => (fullScreen ? theme.zIndex.appBar + 10 : 'inherit'),
    }}
    >
      <Toolbar variant="dense">
        <BookTitle book={book} />
        <BreadcrumbSeparator />
        <ChaptersSelector book={book} selectedChapter={selectedChapter} />
        <Divider orientation="vertical" sx={{ flex: 1 }} />
        <ButtonWithTooltip tooltip="settings" onClick={() => setShowDrawer(true)}><SettingsIcon /></ButtonWithTooltip>
      </Toolbar>

      <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <List>
          <ThemeSelector onThemeChanged={setSelectedTheme} />
          <LineHeightSelector onValueChanged={setSelectedLineHeight} />
          <FontList value={font} onFontSelected={setFont} storageKey={ReaderFontStorageKey} />
          <Divider />

          <ListItemButton onClick={onZoomInText} disabled={fontScale >= MaximumFontScale}>
            <ListItemIcon>
              <ZoomInIcon />
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id="action.zoom.in" />} />
          </ListItemButton>

          <ListItemButton onClick={onZoomOutText} disabled={fontScale <= MinimumFontScale}>
            <ListItemIcon>
              <ZoomOutIcon />
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id="action.zoom.out" />} />
          </ListItemButton>

          <Divider />

          {renderColumnLayout()}
          <ListItemButton onClick={onFullScreenToggle} selected={fullScreen}>
            <ListItemIcon>
              {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon /> }
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id={fullScreen ? 'chapter.toolbar.exitFullScreen' : 'chapter.toolbar.fullScreen'} />} />
          </ListItemButton>
        </List>
      </Drawer>
      <Reader
        data={data}
        format={format}
        font={font}
        isRtlBook={book && localeService.isRtl(book.language)}
        fontScale={fontScale}
        theme={selectedTheme}
        view={view}
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
};

export default ReaderView;
