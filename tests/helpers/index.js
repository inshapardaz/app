import { libraryMock, authenticationMock } from '../mock';

const setLibrary = (libraryId) => {
  localStorage.setItem('library', libraryId || '1');
};

const logIn = () => {
  localStorage.setItem('user', '{"id": 1, "name": "john doe", "email": "john.doe@gmail.com", "isSuperAdmin": false, "created": "2020-11-27T22:45:35.7750096", "updated": "2021-06-08T17:14:51.8238407", "isVerified": true, "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "refreshToken": "3005E83132F7DC46479818B7"}');
  authenticationMock.mockTokenRefresh();
  libraryMock.mockEntry();
  libraryMock.mockCategories();
  setLibrary();
};

const loginAsAdmin = () => {
  localStorage.setItem('user', '{"id": 1, "name": "john doe", "email": "john.doe@gmail.com", "isSuperAdmin": true, "created": "2020-11-27T22:45:35.7750096", "updated": "2021-06-08T17:14:51.8238407", "isVerified": true, "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "refreshToken": "3005E83132F7DC46479818B7"}');
  authenticationMock.mockTokenRefreshAsAdmin();
  libraryMock.mockEntryAsAdmin();
  libraryMock.mockCategories();
  setLibrary();
};

const logInWithoutLibrarySelection = () => {
  localStorage.setItem('user', '{"id": 1, "name": "john doe", "email": "john.doe@gmail.com", "isSuperAdmin": false, "created": "2020-11-27T22:45:35.7750096", "updated": "2021-06-08T17:14:51.8238407", "isVerified": true, "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "refreshToken": "3005E83132F7DC46479818B7"}');
  authenticationMock.mockTokenRefresh();
  libraryMock.mockEntry();
  libraryMock.mockCategories();
};

const logOut = () => {
  localStorage.removeItem('user');
};

export {
  logIn, loginAsAdmin, logOut, setLibrary, logInWithoutLibrarySelection,
};
