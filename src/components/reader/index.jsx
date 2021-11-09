import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Local Imports
import { libraryService } from '@/services/';
import Reader from '@/components/reader/reader';
import FontMenu from '@/components/fontMenu';
import ButtonWithTooltip from '@/components/buttonWithTooltip';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';

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

const ChaptersSelector = ({ book, selectedChapter }) => {
  const [chapters, setChapters] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadData = () => {
    setBusy(true);
    setError(false);

    libraryService.getBookChapters(book.links.chapters)
      .then((res) => setChapters(res))
      .then(() => setBusy(false))
      .catch(() => {
        setBusy(false);
        setError(true);
      });
  };

  useEffect(() => {
    if (book) {
      loadData();
    }
  }, [book]);

  if (!book || !selectedChapter || !chapters) return null;

  return (
    <>
      <Button
        id="chapter-button"
        aria-controls={open ? 'chapter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedChapter.title}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {!busy && !error && chapters.data.map((c) => (
          <MenuItem
            key={c.id}
            component={Link}
            to={`/books/${book.id}/chapters/${c.chapterNumber}`}
            value={c.key}
            selected={selectedChapter.id === c.id}
            onClick={handleClose}
          >
            {c.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ChaptersSelector.defaultProps = {
  book: null,
  selectedChapter: null,
};

ChaptersSelector.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  selectedChapter: PropTypes.shape({
    id: PropTypes.number,
    chapterNumber: PropTypes.number,
    title: PropTypes.string,
  }),
};

// -------------------------------------------------------------
const ReaderView = ({
  book, selectedChapter, data, format = 'text',
}) => {
  const [font, setFont] = useState(localStorage.getItem(ReaderFontStorageKey) || 'MehrNastaleeq');
  const [fontScale, setFontScale] = useState(parseFloat(localStorage.getItem(ReaderFontSizeStorageKey) || '1.0', 10));
  const [fullScreen, setFullScreen] = useState(false);

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
      backgroundColor: (theme) => theme.palette.background.paper,
      position: (fullScreen ? 'absolute' : 'block'),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: (theme) => (fullScreen ? theme.zIndex.appBar + 10 : 'inherit'),
    }}
    >
      <AppBar position="static" color="transparent" elevation={0} variant="outlined">
        <Toolbar>
          <BookTitle book={book} />
          <BreadcrumbSeparator />
          <ChaptersSelector book={book} selectedChapter={selectedChapter} />
          <Divider orientation="vertical" sx={{ flex: 1 }} />
          <FontMenu value={font} onFontSelected={setFont} storageKey={ReaderFontStorageKey} />
          <ButtonWithTooltip variant="outlined" tooltip={<FormattedMessage id="action.zoom.in" />} onClick={onZoomInText} disabled={parseFloat(fontScale) >= MaximumFontScale}>
            <ZoomInIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip variant="outlined" tooltip={<FormattedMessage id="action.zoom.out" />} onClick={onZoomOutText} disabled={parseFloat(fontScale) <= MinimumFontScale}>
            <ZoomOutIcon />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            tooltip={<FormattedMessage id={fullScreen ? 'chapter.toolbar.exitFullScreen' : 'chapter.toolbar.fullScreen'} />}
            onClick={onFullScreenToggle}
            variant="outlined"
          >
            {fullScreen ? <FullscreenExitIcon />
              : <FullscreenIcon /> }
          </ButtonWithTooltip>
        </Toolbar>
      </AppBar>
      <Reader data={data} format={format} font={font} fontScale={fontScale} height={fullScreen ? 'calc(100vh - 65px)' : 'calc(100vh - 200px)'} />
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
  }),
  data: PropTypes.string,
  format: PropTypes.string,
};

export default ReaderView;
