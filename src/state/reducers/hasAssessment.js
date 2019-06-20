export default function hasAssessment (state = false, action = null)
{
	if (action === null)
	{
		return state;
	}

	if (action.type === 'ASSESSMENT_HISTORY_DETERMINED')
	{
		return action.payload.length > 0;
	}

	return state;
}
