import config from 'config';

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

const isUserLoggedIn = () => getUser() != null;

const authHeader = (url) => {
  const isApiUrl = url.startsWith(config.apiUrl);
  if (isUserLoggedIn() && isApiUrl) {
    return { Authorization: `Bearer ${getAccessToken()}` };
  }
  return {};
};

const handleResponse = (response) => response.text().then((text) => {
  const data = text && JSON.parse(text);

  if (!response.ok) {
    if ([401, 403].includes(response.status) && isUserLoggedIn()) {
      // TODO : Do a token refresh
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      // accountService.logout();
    }

    return Promise.reject({ status: response.status, statusText: response.statusText });
  }

  return data;
});

const get = (url, headers = {}) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(url),
    ...headers,
  };
  return fetch(url, requestOptions).then(handleResponse);
};

const getRaw = (url, headers = {}) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(url),
    ...headers,
  };
  return fetch(url, requestOptions);
};

const post = (url, body, headers = {}) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(url), ...headers },
    credentials: 'include',
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
};

const put = (url, body, headers = {}) => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader(url), ...headers },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
};

const downloadFile = (url, headers = {}) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(url),
    ...headers,
  };
  return fetch(url, requestOptions).then((response) => response.blob());
};

const putFile = (url, body, headers = {}) => {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(url), ...headers },
    body,
  };
  return fetch(url, requestOptions).then(handleResponse);
};

const postFile = (url, body, headers = {}) => {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(url), ...headers },
    body,
  };
  return fetch(url, requestOptions).then(handleResponse);
};

// prefixed with underscored because delete is a reserved word in javascript
const _delete = (url, headers = { }) => {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(url),
    ...headers,
  };
  return fetch(url, requestOptions).then(handleResponse);
};

export default {
  get,
  getRaw,
  post,
  put,
  delete: _delete,
  putFile,
  postFile,
  downloadFile,
};
