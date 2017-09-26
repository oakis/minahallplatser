import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CHANGED_SECOND,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	LOGIN_USER,
	LOGIN_ANON_USER,
	REGISTER_USER,
	REGISTER_USER_FAIL,
	CHANGE_ROUTE,
	RESET_PASSWORD
} from '../actions/types';

const INIT_STATE = {
	email: '',
	password: '',
	passwordSecond: '',
	user: {},
	loading: false,
	loadingAnon: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case EMAIL_CHANGED:
			return { ...state, email: action.payload };
		case PASSWORD_CHANGED:
			return { ...state, password: action.payload };
		case PASSWORD_CHANGED_SECOND:
			return { ...state, passwordSecond: action.payload };
		case LOGIN_USER_SUCCESS:
			return {
				...state,
				email: '',
				password: '',
				passwordSecond: '',
				loading: false,
				loadingAnon: false,
				user: action.payload
			};
		case LOGIN_USER_FAIL:
			return { ...state, password: '', loading: false, loadingAnon: false };
		case LOGIN_USER:
			return { ...state, loading: true };
		case LOGIN_ANON_USER:
			return { ...state, loadingAnon: true };
		case REGISTER_USER:
			return { ...state, loading: true };
		case REGISTER_USER_FAIL:
			return { ...state, loading: false };
		case CHANGE_ROUTE:
			return { ...INIT_STATE };
		case RESET_PASSWORD:
			return { ...INIT_STATE };
		default:
			return state;
	}
};
