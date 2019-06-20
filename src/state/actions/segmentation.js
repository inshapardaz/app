export function getPartnerStatus ()
{
	return async (dispatch, getState, { segmentationService }) =>
	{
		const segmentation = await segmentationService.getPartnerStatus();

		if (segmentation === null)
		{
			throw new Error('The restaurant does not have a partner status.');
		}

		dispatch({
			type : 'STATUS_DETERMINED', payload : segmentation.status
		});

		dispatch({
			type : 'REQUIREMENTS_DETERMINED', payload : segmentation.requirements
		});

		const nextAssessmentDate = await segmentationService.getNextAssessmentDate();

		dispatch({
			type : 'NEXT_ASSESSMENT_DETERMINED', payload : nextAssessmentDate
		});
	};
}

export function getAssessmentHistory ()
{
	return async (dispatch, getState, { segmentationService }) =>
	{
		const history = await segmentationService.getAssessmentHistory();

		if (history === null)
		{
			throw new Error('The restaurant does not have an assessment history.');
		}

		dispatch({
			type : 'ASSESSMENT_HISTORY_DETERMINED', payload : history
		});
	};
}
