import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import { SnackbarProvider } from 'notistack';
import { ConfirmProvider } from 'material-ui-confirm';
import configureStore from '@/store';
import browserHistory from '@/store/browserHistory';

import Routes from '@/router';
import Intl from '@/components/intl';
import Notifier from '@/components/notifier';
import Theme from '@/components/theme';

import './index.css';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <Intl>
        <Theme>
          <ConfirmProvider>
            <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
              <Notifier />
              <Routes />
            </SnackbarProvider>
          </ConfirmProvider>
        </Theme>
      </Intl>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
