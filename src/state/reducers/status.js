export default function status (state = null, action = null)
{
	if (action === null)
	{
		return state;
	}

	if (action.type === 'STATUS_DETERMINED')
	{
		return action.payload;
	}

	return state;
}
