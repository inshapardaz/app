import { ENTRY, LANGUAGES, ATTRIBUTES, RELATIONSHIPTYPES, CATEGORIES, SERIES } from '../actions/actionTypes';

export default function apiReducer (state = {}, action)
{
	switch (action.type)
	{
		case ENTRY :
			return {
				...state,
				entry : action.payload
			};
		case LANGUAGES :
			return {
				...state,
				languages : action.payload
			};
		case ATTRIBUTES :
			return {
				...state,
				attributes : action.payload
			};
		case RELATIONSHIPTYPES :
			return {
				...state,
				relationshipTypes : action.payload
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
		default :
			return state;
	}
}
