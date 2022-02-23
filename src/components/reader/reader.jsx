import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage } from 'react-intl';

// MUI
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Local Import
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const Reader = ({
  data, format = 'text', font, fontScale, height, isRtlBook,
  canGoBack, onBack, canGoForward, onForward, theme, lineHeight, view,
}) => {
  const anchorRef = useRef(null);
  const [pageLeft, setPageLeft] = useState(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const isNarrowScreen = useMediaQuery('(max-width:1300px)');
  const isMobile = useMediaQuery('(max-width:430px)');
  const [page, setPage] = useState(1);

  const isSinglePage = view === 'single' || isNarrowScreen;
  const pageWidth = isMobile ? 340 : isSinglePage ? 601 : 1202;
  const style = {
    fontFamily: font,
    fontSize: `${fontScale}em`,
    textAlign: 'justify',
    columnCount: isSinglePage ? '1' : '2',
    columnGap: '50px',
    columnFill: 'auto',
    padding: '10px 0',
    position: 'relative',
    width: `${pageWidth - 50}px`,
    transition: 'left .25s',
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
    <div dir={isRtlBook ? 'rtl' : 'ltr'}>
      <Grid container justifyContent="center" alignItems="center" wrap="nowrap" sx={{ ...theme }}>
        <Grid item>
          {renderPrevious()}
        </Grid>
        <Grid item>
          <Container maxWidth={isSinglePage ? 'sm' : 'lg'} sx={{ overflow: 'hidden' }}>
            <div style={style} ref={anchorRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              {renderContents()}
            </div>

          </Container>
        </Grid>
        <Grid item>
          {renderNext()}
        </Grid>
      </Grid>
    </div>
  );
};

Reader.defaultProps = {
  data: '',
  format: 'text',
  font: 'MehrNastaleeq',
  fontScale: null,
  lineHeight: 1.0,
  view: 'two',
  isRtlBook: 'false',
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
  theme: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
  })),
  lineHeight: PropTypes.number,
  view: PropTypes.string,
  isRtlBook: PropTypes.bool,
  height: PropTypes.string.isRequired,
  canGoBack: PropTypes.bool,
  onBack: PropTypes.func,
  canGoForward: PropTypes.bool,
  onForward: PropTypes.func,
};

export default Reader;
