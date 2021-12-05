import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

// MUI
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '6ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SearchBox = ({ value, onChange }) => {
  const intl = useIntl();
  const [query, setQuery] = useState(value);

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      onChange(query);
    }
  };

  const clear = () => {
    setQuery('');
    onChange('');
  };

  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        data-ft="app-search"
        placeholder={intl.formatMessage({ id: 'header.search' })}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={keyPress}
        value={query || ''}
        inputProps={{ 'aria-label': 'search' }}
        endAdornment={query && query.trim() !== '' && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={clear}
              onMouseDown={clear}
            >
              <HighlightOffIcon />
            </IconButton>
          </InputAdornment>
        )}
      />
    </Search>
  );
};

SearchBox.defaultProps = {
  value: '',
};

SearchBox.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
export default SearchBox;
