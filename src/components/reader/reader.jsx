import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';

// MUI
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Reader = ({
  data, format = 'text', font, fontScale, height,
  canGoBack, onBack, canGoForward, onForward, theme, lineHeight, view,
}) => {
  const anchorRef = useRef(null);
  const [pageLeft, setPageLeft] = useState(0);

  const isNarrowScreen = useMediaQuery('(max-width:1300px)');
  const [page, setPage] = useState(1);

  const isSinglePage = view === 'single' || isNarrowScreen;
  const pageWidth = isSinglePage ? 601 : 1202;
  const style = {
    fontFamily: font,
    fontSize: `${fontScale}em`,
    textAlign: 'justify',
    columnCount: isSinglePage ? '1' : '2',
    columnGap: '50px',
    padding: '10px 0',
    position: 'relative',
    minWidth: `${pageWidth - 50}px`,
    lineHeight,
    height,
    left: pageLeft,
    ...theme,
  };

  useEffect(() => {
    setPage(1);
    setPageLeft(0);
  }, [data]);

  // ----- Previous Page Links ---------------
  const isOnFistPage = () => pageLeft <= 0;
  const onPrevious = () => {
    if (!isOnFistPage()) {
      setPageLeft(pageLeft - pageWidth);
      setPage(page - 1);
    } else if (canGoBack) {
      onBack();
    }
  };

  const canGoPrevious = () => !isOnFistPage() || canGoBack;

  // ----- Next Page Links ---------------
  const isOnLastPage = () => (anchorRef && anchorRef.current && pageLeft >= anchorRef.current.scrollWidth - pageWidth);

  const onNext = () => {
    if (!isOnLastPage()) {
      setPageLeft(pageLeft + pageWidth);
      setPage(page + 1);
    } else if (canGoForward) {
      onForward();
    }
  };

  const canGoNext = () => !isOnLastPage() || canGoForward;

  const renderContents = () => {
    if (format === 'html') {
      return parse(data);
    }
    if (format === 'markdown') {
      return (<ReactMarkdown>{data}</ReactMarkdown>);
    }

    return data;
  };

  const renderPrevious = () => (
    <IconButton
      disabled={!canGoPrevious()}
      onClick={onPrevious}
    >
      <ChevronRightIcon />
    </IconButton>
  );

  const renderNext = () => (
    <IconButton
      disabled={!canGoNext()}
      onClick={onNext}
    >
      <ChevronLeftIcon />
    </IconButton>
  );

  if (!data) return null;

  return (
    <Grid container justifyContent="center" alignItems="center" wrap="nowrap" sx={theme}>
      <Grid item>
        {renderPrevious()}
      </Grid>
      <Grid item>
        <Container maxWidth={isSinglePage ? 'sm' : 'lg'} sx={{ overflow: 'hidden' }}>
          <div style={style} ref={anchorRef}>
            {renderContents()}
          </div>
        </Container>
      </Grid>
      <Grid item>
        {renderNext()}
      </Grid>
    </Grid>
  );
};

Reader.defaultProps = {
  data: '',
  format: 'text',
  font: 'MehrNastaleeq',
  fontScale: null,
  lineHeight: 1.0,
  view: 'two',
  theme: {},
  canGoBack: false,
  onBack: () => {},
  canGoForward: false,
  onForward: () => {},
};

Reader.propTypes = {
  data: PropTypes.string,
  format: PropTypes.string,
  font: PropTypes.string,
  fontScale: PropTypes.number,
  theme: PropTypes.object,
  lineHeight: PropTypes.number,
  view: PropTypes.string,
  height: PropTypes.string.isRequired,
  canGoBack: PropTypes.bool,
  onBack: PropTypes.func,
  canGoForward: PropTypes.bool,
  onForward: PropTypes.func,
};

export default Reader;
