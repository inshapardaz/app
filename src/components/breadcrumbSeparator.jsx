import React from 'react';

// MUI
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Local Imports
import { localeService } from '@/services/';

const BreadcrumbSeparator = () => {
  if (localeService.isRtl()) { return (<NavigateBeforeIcon fontSize="small" />); }
  return (<NavigateNextIcon fontSize="small" />);
};

export default BreadcrumbSeparator;
