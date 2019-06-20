import { LOGIN, LOGOUT, CHANGEPASSWORD } from '../actions/actionTypes';

export default function authenticationReducer (state = {}, action)
{
	switch (action.type)
	{
		case LOGIN :
			return state;
		case LOGOUT :
			return state;
		case CHANGEPASSWORD :
			return state;
		default :
			return state;
	}
}

