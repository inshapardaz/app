import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';

// MUI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Local Import
import ButtonWithTooltip from '@/components/buttonWithTooltip';
import { getSelectedTheme } from '@/components/reader/themeSelector';
import { localeService } from '@/services/';
import useKeyPress from '@/helpers/useKeyPress';

const ReaderFontSizeStorageKey = 'reader.fontSize';
const ReaderFontStorageKey = 'reader.font';

const getTopPageImage = (isSingle, theme) => {
  if (isSingle) {
    return theme.background.topSingle;
  }

  return theme.background.top;
};

const getMiddlePageImage = (isSingle, theme) => {
  if (isSingle) {
    return theme.background.middleSingle;
  }

  return theme.background.middle;
};

const getBottomPageImage = (isSingle, theme) => {
  if (isSingle) {
    return theme.background.bottomSingle;
  }

  return theme.background.bottom;
};

const calculateViewHeight = (fullScreen, singlePage) => {
  if (fullScreen) {
    if (singlePage) {
      return 'calc(100vh - 162px)';
    }

    return 'calc(100vh - 178px)';
  }

  if (singlePage) {
    return 'calc(100vh - 224px)';
  }

  return 'calc(100vh - 234px)';
};

const Reader = ({
  data, format = 'text', book, chapter, fullScreen,
  canGoBack, onBack, canGoForward, onForward, view, onChapterClicked,
}) => {
  const theme = useTheme();
  const leftPressed = useKeyPress('ArrowLeft');
  const rightPressed = useKeyPress('ArrowRight');

  const selectedTheme = getSelectedTheme();
  const [font] = useLocalStorage(ReaderFontStorageKey, 'MehrNastaleeq');
  const [fontScale] = useLocalStorage(ReaderFontSizeStorageKey, 1.0);
  const [lineHeight] = useLocalStorage('reader.lineHeight', 1.0);

  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const isNarrowScreen = useMediaQuery('(max-width:1300px)');
  const isMobile = useMediaQuery('(max-width:430px)');
  const [page, setPage] = useState(1);

  const isSinglePage = view === 'single' || isNarrowScreen;
  // eslint-disable-next-line no-nested-ternary
  const pageWidth = isMobile ? 430 : isSinglePage ? 610 : 1216;
  const columnWidth = isSinglePage ? 500 : 526;
  const columnGap = 64;
  const [pageCount, setPageCount] = useState(isSinglePage ? 1 : 2);

  const anchorRef = useCallback((node) => {
    if (node !== null) {
      setPageCount(Math.ceil(node.scrollWidth / columnWidth));
    }
  });

  const isRtlBook = book !== null ? localeService.isRtl(book.language) : false;
  const height = calculateViewHeight(fullScreen, isSinglePage);

  const style = {
    fontFamily: font,
    fontSize: `${fontScale}em`,
    textAlign: 'justify',
    columnCount: isSinglePage ? '1' : '2',
    columnGap,
    columnFill: 'auto',
    position: 'relative',
    backgroundColor: 'transparent',
    lineHeight,
    maxHeight: isSinglePage ? '800px' : '100vh',
    height,
    left: isRtlBook ? (page - 1) * columnWidth : 'auto',
    right: isRtlBook ? 'auto' : (page - 1) * columnWidth,
    ...selectedTheme.style,
    img: {
      maxWidth: columnWidth - columnGap,
    },
  };

  const stylePageTop = {
    backgroundImage: getTopPageImage(isSinglePage, selectedTheme),
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPositionY: 'bottom',
    display: 'flex',
    alignItems: 'end',
    justifyContent: isSinglePage ? 'space-between' : 'space-around',
    fontFamily: font,
    fontSize: `${fontScale / 1.5}em`,
    height: isSinglePage ? '72px' : '76px',
    padding: '0 38px',
    marginTop: '6px',
  };

  const stylePageMiddle = {
    backgroundImage: getMiddlePageImage(isSinglePage, selectedTheme),
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-y',
    backgroundOrigin: 'padding-box',
    width: `${pageWidth - columnGap}px`,
    padding: isSinglePage ? '10px 55px' : '10px 82px',
    overflow: 'hidden',
  };

  const stylePageBottom = {
    backgroundImage: getBottomPageImage(isSinglePage, selectedTheme),
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'space-around',
    fontFamily: font,
    fontSize: `${fontScale / 1.5}em`,
    height: isSinglePage ? '60px' : '99px',
  };

  useEffect(() => {
    setPage(1);
  }, [data]);

  // ----- Previous Page Links ---------------
  const isOnFistPage = () => page <= 1;
  const onPrevious = () => {
    if (!isOnFistPage()) {
      const newPage = page - (isSinglePage ? 1 : 2);
      setPage(newPage);
    } else if (canGoBack) {
      onBack();
    }
  };

  const canGoPrevious = () => !isOnFistPage() || canGoBack;

  // ----- Next Page Links ---------------
  const isOnLastPage = () => page + 1 >= pageCount;

  const onNext = () => {
    if (!isOnLastPage()) {
      const newPage = page + (isSinglePage ? 1 : 2);
      setPage(newPage);
    } else if (canGoForward) {
      onForward();
    }
  };

  const canGoNext = () => !isOnLastPage() || canGoForward;

  useEffect(() => {
    if (leftPressed) {
      if (isRtlBook) {
        onNext();
      } else {
        onPrevious();
      }
    }
  }, [leftPressed]);

  useEffect(() => {
    if (rightPressed) {
      if (isRtlBook) {
        onPrevious();
      } else {
        onNext();
      }
    }
  }, [rightPressed]);

  const renderContents = () => {
    if (format === 'html') {
      return parse(data);
    }
    if (format === 'markdown') {
      return (<ReactMarkdown>{data}</ReactMarkdown>);
    }

    return data;
  };

  const renderPrevious = () => {
    if (isMobile) return null;

    return (
      <ButtonWithTooltip
        disabled={!canGoPrevious()}
        onClick={onPrevious}
        tooltip={<FormattedMessage id="reader.previous" />}
      >
        {isRtlBook ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
      </ButtonWithTooltip>
    );
  };

  const renderNext = () => {
    if (isMobile) return null;

    return (
      <ButtonWithTooltip
        disabled={!canGoNext()}
        onClick={onNext}
        tooltip={<FormattedMessage id="reader.next" />}
      >
        {isRtlBook ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
      </ButtonWithTooltip>
    );
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100 && canGoPrevious()) {
      onPrevious();
    }

    if (touchStart - touchEnd < -100 && canGoNext()) {
      onNext();
    }
  };

  if (!data) return null;

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      position: (fullScreen ? 'absolute' : 'block'),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      direction: isRtlBook ? 'rtl' : 'ltr',
      zIndex: fullScreen ? theme.zIndex.appBar + 5 : 'inherit',
    }}
    >
      <div dir={isRtlBook ? 'rtl' : 'ltr'}>
        <Grid container justifyContent="center" alignItems="center" wrap="nowrap" sx={{ ...selectedTheme }}>
          <Grid item>
            {renderPrevious()}
          </Grid>
          <Grid item>
            <Container maxWidth={isSinglePage ? 'sm' : 'lg'} sx={{ overflow: 'hidden' }}>
              <div style={stylePageTop}>
                <Link to={`/books/${book.id}`}>{book && book.title}</Link>
                <Button variant="text" sx={{ color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }} onClick={onChapterClicked}>{chapter && chapter.title}</Button>
              </div>
              <div style={stylePageMiddle}>
                <div style={style} ref={anchorRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                  {renderContents()}
                </div>
              </div>
              <div style={stylePageBottom} />
            </Container>
          </Grid>
          <Grid item>
            {renderNext()}
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

Reader.defaultProps = {
  data: '',
  format: 'text',
  view: 'two',
  book: null,
  chapter: null,
  fullScreen: false,
  canGoBack: false,
  onBack: () => {},
  canGoForward: false,
  onForward: () => {},
  onChapterClicked: () => {},
};

Reader.propTypes = {
  data: PropTypes.string,
  format: PropTypes.string,
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  chapter: PropTypes.shape({
    id: PropTypes.number,
    chapterNumber: PropTypes.number,
    title: PropTypes.string,
  }),
  view: PropTypes.string,
  canGoBack: PropTypes.bool,
  fullScreen: PropTypes.bool,
  onBack: PropTypes.func,
  canGoForward: PropTypes.bool,
  onForward: PropTypes.func,
  onChapterClicked: PropTypes.func,
};

export default Reader;
