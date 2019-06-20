export default function isLoggedIn (state = false, action = null)
{
	if (action === null)
	{
		return state;
	}

	if (action.type === 'USER_LOGGED_IN')
	{
		return true;
	}

	if (action.type === 'USER_AUTHENTICATED')
	{
		return action.payload;
	}

	return state;
}
