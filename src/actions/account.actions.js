import { accountService, localeService } from '@/services';
import notificationActions from './notification.actions';
import browserHistory from '@/store/browserHistory';

export const LOGIN_REQUEST = 'USERS_LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'USERS_LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'USERS_LOGIN_FAILURE';
export const LOGOUT = 'USERS_LOGOUT';

const initializeAuth = () => (dispatch) => {
  if (accountService.isUserLoggedIn()) {
    return accountService.refreshToken()
      .then((user) => {
        dispatch({
          type: 'authInit',
          payload: user,
        });
      }, (e) => {
        if (e.status === 401) {
          return accountService.logout()
            .then(() => browserHistory.push('/account/login'));
        }

        dispatch({
          type: 'authInit',
          payload: null,
        });
        console.error('Error initialize auth');
        console.error(e);
        if (e.status) {
          browserHistory.push(`/error/${e.status}`);
        } else { browserHistory.push('/error/500'); }
      });
  }

  dispatch({
    type: 'authInit',
    payload: null,
  });

  return Promise.reject();
};

const loginAction = (email, password) => (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
    payload: email,
  });

  return accountService.login(email, password)
    .then((user) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user,
      });

      const { from } = browserHistory.location.state || { from: { pathname: '/' } };

      browserHistory.replace(from);
    }, () => {
      dispatch(notificationActions.showError(localeService.formatMessage({ id: 'login.message.error' })));
      dispatch({ type: LOGIN_FAILURE, payload: email });
    });
};

const logoutAction = () => (dispatch) => {
  accountService.logout()
    .then(() => {
      dispatch({
        type: LOGOUT,
        payload: null,
      });
    });
};

export default { initializeAuth, loginAction, logoutAction };
