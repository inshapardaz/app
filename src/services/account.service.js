import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '../helpers';

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/accounts`;

export const accountService = {
    login,
    logout,
    refreshToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
	getById,
	getAccountLibraries,
	addAccountLibrary,
	deleteAccountLibrary,
    create,
	update,
	updatePassword,
    delete: _delete,
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value }
};

const getQueryParameter = (query) => (query ? `&query=${query}` : '');

const _parseObject = (source) =>
{
	if (source)
	{
		if (source.links)
		{
			let newLinks = {};
			source.links.forEach(link =>
			{
				newLinks[link.rel.replace('-', '_')] = link.href;
			});
			source.links = newLinks;
		}

		if (source.data)
		{
			let newItems = [];
			source.data.forEach(item => newItems.push(_parseObject(item)));
			source.data = newItems;
		}

		if (source.files)
		{
			let newItems = [];
			source.files.forEach(item => newItems.push(_parseObject(item)));
			source.files = newItems;
		}

		if (Array.isArray(source))
		{
			let newItems = [];
			source.forEach(item => newItems.push(_parseObject(item)));
			return newItems;
		}
	}

	return source;
};

function login(email, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password })
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            userSubject.next(user);
            startRefreshTokenTimer();
            return user;
        });
}

function logout() {
    // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
    fetchWrapper.post(`${baseUrl}/revoke-token`, {});
    stopRefreshTokenTimer();
    userSubject.next(null);
    history.push('/account/login');
}

function refreshToken() {
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            userSubject.next(user);
            startRefreshTokenTimer();
            return user;
        });
}

function register(params) {
    return fetchWrapper.post(`${baseUrl}/register`, params);
}

function verifyEmail(token) {
    return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email) {
    return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function validateResetToken(token) {
    return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

function resetPassword({ token, password, confirmPassword }) {
    return fetchWrapper.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
}

function getAll(query = null, pageNumber = 1, pageSize = 12) {
	return fetchWrapper.get(`${baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}${getQueryParameter(query)}`)
		.then(data => _parseObject(data));
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function getAccountLibraries(id) {
	return fetchWrapper.get(`${baseUrl}/${id}/libraries`)
		.then(data => _parseObject(data));
}

function addAccountLibrary(id, libraryId) {
	return fetchWrapper.post(`${baseUrl}/${id}/libraries/`, libraryId );
}

function deleteAccountLibrary(id, libraryId) {
	return fetchWrapper.delete(`${baseUrl}/${id}/libraries/${libraryId}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(user => {
            // update stored user if the logged in user updated their own record
            if (user.id === userSubject.value.id) {
                // publish updated user to subscribers
                user = { ...userSubject.value, ...user };
                userSubject.next(user);
            }
            return user;
        });
}

function updatePassword(id, params) {
	return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(user => {
            // update stored user if the logged in user updated their own record
            if (user.id === userSubject.value.id) {
                // publish updated user to subscribers
                user = { ...userSubject.value, ...user };
                userSubject.next(user);
            }
            return user;
        });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(x => {
            // auto logout if the logged in user deleted their own record
            if (id === userSubject.value.id) {
                logout();
            }
            return x;
        });
}

// helper functions

let refreshTokenTimeout;

function startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}
