export default function nextAssessmentDate (state = null, action = null)
{
	if (action === null)
	{
		return state;
	}

	if (action.type === 'NEXT_ASSESSMENT_DETERMINED')
	{
		return action.payload;
	}

	return state;
}
