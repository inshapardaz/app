/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';

// MUI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Styled
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Local Imports
import localeService from '@/services/locale.service';

const Rtl = ({ rtl, children }) => {
  if (rtl) {
    const cacheRtl = createCache({
      key: 'muirtl',
      stylisPlugins: [rtlPlugin],
    });

    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return children;
};

const Theme = (props) => {
  const isRtl = useSelector((state) => state.localeReducer.isRtl);
  const isDarkMode = useSelector((state) => state.uiReducer.darkMode);
  const library = useSelector((state) => state.libraryReducer.library);

  const paletteMode = isDarkMode ? 'dark' : 'light';
  const theme = createTheme({
    direction: isRtl ? 'rtl' : 'ltr',

    typography: {
      fontFamily: [
        ...localeService.getPreferredFont(),
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    palette: {
      primary: {
        main: library && library.primaryColor ? library.primaryColor : '#373837',
        light: library && library.secondaryColor ? library.secondaryColor : '#848484',
      },
      mode: paletteMode,
    },
  });

  document.body.dir = isRtl ? 'rtl' : 'ltr';

  return (
    <Rtl rtl={isRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </Rtl>
  );
};

export default Theme;
