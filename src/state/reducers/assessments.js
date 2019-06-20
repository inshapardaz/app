export default function assessments (state = [], action = null)
{
	if (action === null)
	{
		return state;
	}

	if (action.type === 'ASSESSMENT_HISTORY_DETERMINED')
	{
		return action.payload;
	}

	return state;
}
