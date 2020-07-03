import { ENTRY, CATEGORIES, SERIES, LATEST_BOOKS } from '../actions/actionTypes';

export default function apiReducer (state = {}, action)
{
	switch (action.type)
	{
		case ENTRY :
			return {
				...state,
				entry : action.payload
			};
		case CATEGORIES :
			return {
				...state,
				categories : action.payload
			};
		case SERIES :
			return {
				...state,
				series : action.payload
			};
		case LATEST_BOOKS :
			return {
				...state,
				latestBooks : action.payload
			};
		default :
			return state;
	}
}
