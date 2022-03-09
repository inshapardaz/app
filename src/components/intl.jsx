import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Helmet } from 'react-helmet';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// Local Imports
import localeService from '@/services/locale.service';
import actions from '@/actions';

const Intl = (props) => {
  const dispatch = useDispatch();
  const locale = useSelector((state) => state.localeReducer.language);

  useEffect(() => dispatch(actions.initLocaleAction()), []);

  const messages = localeService.getMessages();

  return (
    <IntlProvider locale={locale} messages={messages} textComponent={Fragment} onError={() => null}>
      <Helmet titleTemplate={`${messages.app} - %s`} />
      <LocalizationProvider dateAdapter={DateAdapter}>
        {props.children}
      </LocalizationProvider>
    </IntlProvider>
  );
};

export default Intl;
