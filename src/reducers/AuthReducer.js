import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CHANGED_SECOND,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	LOGIN_USER,
	REGISTER_USER,
	REGISTER_USER_FAIL,
	CHANGE_ROUTE,
	RESET_PASSWORD,
	GET_TOKEN
} from '../actions/types';

const INIT_STATE = {
	email: '',
	password: '',
	passwordSecond: '',
	user: {},
	error: '',
	loading: false,
	token: ''
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case EMAIL_CHANGED:
			return { ...state, email: action.payload, error: '' };
		case PASSWORD_CHANGED:
			return { ...state, password: action.payload, error: '' };
		case PASSWORD_CHANGED_SECOND:
			return { ...state, passwordSecond: action.payload, error: '' };
		case LOGIN_USER_SUCCESS:
			return {
				...state,
				email: '',
				password: '',
				passwordSecond: '',
				loading: false,
				user: action.payload.user,
				token: action.payload.token,
				error: ''
			};
		case LOGIN_USER_FAIL:
			console.log(action);
			return { ...state, password: '', loading: false, error: action.payload };
		case LOGIN_USER:
			return { ...state, loading: true, error: '' };
		case REGISTER_USER:
			return { ...state, loading: true, error: '' };
		case REGISTER_USER_FAIL:
			return { ...state, loading: false, error: action.payload.error };
		case CHANGE_ROUTE:
			return { ...INIT_STATE };
		case RESET_PASSWORD:
			return { ...INIT_STATE, error: action.payload };
		case GET_TOKEN:
			return { ...state, token: action.payload };
		default:
			return state;
	}
};
