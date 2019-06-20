export function login ()
{
	return async (dispatch, getState, { authenticationService }) =>
	{
		await authenticationService.login();

		dispatch({
			type : 'USER_LOGGED_IN'
		});
	};
}

export function logout ({
	isChangingRestaurant = false
})
{
	return async (dispatch, getState, { authenticationService }) =>
	{
		await authenticationService.logout({
			isChangingRestaurant
		});
	};
}

export function forget ()
{
	return async (dispatch, getState, { authenticationService }) =>
	{
		await authenticationService.forget();
	};
}

export function authenticate ()
{
	return async (dispatch, getState, { authenticationService }) =>
	{
		const payload = await authenticationService.authenticate();

		dispatch({
			payload, type : 'USER_AUTHENTICATED'
		});
	};
}
