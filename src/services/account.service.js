/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/no-unresolved
import config from 'config';
import fetchWrapper from './fetch-wrapper';

const baseUrl = `${config.apiUrl}/accounts`;
let refreshTokenTimeout;

const getUser = () => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    return JSON.parse(userJson);
  }

  return null;
};

const getAccessToken = () => {
  const user = getUser();
  if (user) {
    return user.jwtToken;
  }

  return null;
};

const startRefreshTokenTimer = (refreshTokenHandler) => {
  // parse json object from base64 encoded jwt token
  const jwtToken = JSON.parse(atob(getAccessToken().split('.')[1]));

  // set a timeout to refresh the token a minute before it expires
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - (60 * 1000);
  refreshTokenTimeout = setInterval(refreshTokenHandler, timeout);
};

const stopRefreshTokenTimer = () => {
  clearInterval(refreshTokenTimeout);
};

class AccountService {
  isUserLoggedIn() {
    return getUser() != null;
  }

  login(email, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password })
      .then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        startRefreshTokenTimer(this.refreshToken);
        return user;
      });
  }

  logout() {
    const user = getUser();
    stopRefreshTokenTimer();
    return fetchWrapper.post(`${baseUrl}/revoke-token`, { token: (user != null ? user.refreshToken : null) })
      .then(() => {
        localStorage.removeItem('user');
      }, () => {
        localStorage.removeItem('user');
      });
  }

  refreshToken() {
    const user = getUser();
    return fetchWrapper.post(`${baseUrl}/refresh-token`, { refreshToken: (user != null ? user.refreshToken : null) })
      .then((u) => {
        // publish user to subscribers and start timer to refresh token
        localStorage.setItem('user', JSON.stringify(u));
        startRefreshTokenTimer(this.refreshToken);
        return u;
      });
  }

  register(code, params) {
    return fetchWrapper.post(`${baseUrl}/register/${code}`, params);
  }

  verifyInvite(code) {
    return fetchWrapper.getRaw(`${baseUrl}/invitation/${code}`)
      .then((r) => {
        if (r.status !== 200) {
          return Promise.reject(r);
        }

        return r;
      });
  }

  forgotPassword(email) {
    return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
  }

  validateResetToken(token) {
    return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
  }

  resetPassword({ code, password, confirmPassword }) {
    return fetchWrapper.post(`${baseUrl}/reset-password`, { token: code, password, confirmPassword });
  }

  changePassword({ oldPassword, password }) {
    return fetchWrapper.post(`${baseUrl}/change-password`, { oldPassword, password });
  }
}

export default new AccountService();
