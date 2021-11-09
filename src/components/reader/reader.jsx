import React, { useState, useRef } from 'react';
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
}) => {
  const anchorRef = useRef(null);
  const [pageLeft, setPageLeft] = useState(0);

  const isSinglePage = useMediaQuery('(max-width:1300px)');
  const [page, setPage] = useState(1);

  const pageWidth = isSinglePage ? 601 : 1202;
  const style = {
    fontFamily: font,
    fontSize: `${fontScale}em`,
    textAlign: 'justify',
    columnCount: isSinglePage ? '1' : '2',
    columnGap: '50px',
    padding: '10px 0',
    position: 'relative',
    height,
    left: pageLeft,
  };

  const renderContents = () => {
    if (format === 'html') {
      return parse(data);
    }
    if (format === 'markdown') {
      return (<ReactMarkdown>{data}</ReactMarkdown>);
    }

    return data;
  };

  const renderLeft = () => (
    <IconButton
      disabled={pageLeft <= 0}
      onClick={() => {
        setPageLeft(pageLeft - pageWidth);
        setPage(page - 1);
      }}
    >
      <ChevronRightIcon />
    </IconButton>
  );

  const renderRight = () => (
    <IconButton
      disabled={anchorRef && anchorRef.current && pageLeft >= anchorRef.current.scrollWidth - pageWidth}
      onClick={() => {
        setPageLeft(pageLeft + pageWidth);
        setPage(page + 1);
      }}
    >
      <ChevronLeftIcon />
    </IconButton>
  );

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item>
        {renderLeft()}
      </Grid>
      <Grid item>
        <Container maxWidth={isSinglePage ? 'sm' : 'lg'} sx={{ overflow: 'hidden' }}>
          <div style={style} ref={anchorRef}>
            {renderContents()}
          </div>
        </Container>
      </Grid>
      <Grid item>
        {renderRight()}
      </Grid>
    </Grid>
  );
};

Reader.defaultProps = {
  data: '',
  format: 'text',
  font: 'MehrNastaleeq',
  fontScale: null,
};

Reader.propTypes = {
  data: PropTypes.string,
  format: PropTypes.string,
  font: PropTypes.string,
  fontScale: PropTypes.number,
  height: PropTypes.string.isRequired,
};

export default Reader;
