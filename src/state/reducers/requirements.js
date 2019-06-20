export default function requirements (state = null, action = null)
{
	if (action === null)
	{
		return state;
	}

	if (action.type === 'REQUIREMENTS_DETERMINED')
	{
		return action.payload;
	}

	return state;
}
