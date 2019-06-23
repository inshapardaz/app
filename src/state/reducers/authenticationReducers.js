import { LOGIN, LOGOUT, CHANGE_PASSWORD, PROFILE } from '../actions/actionTypes';

export default function authenticationReducer (state = {}, action)
{
	switch (action.type)
	{
		case LOGIN :
			return state;
		case LOGOUT :
			return state;
		case CHANGE_PASSWORD :
			return state;
		case PROFILE :
			return state;
		default :
			return state;
	}
}

