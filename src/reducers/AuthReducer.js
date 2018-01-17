import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CHANGED_SECOND,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	LOGIN_USER,
	LOGIN_ANON_USER,
	RESET_ALL,
	REGISTER_USER,
	REGISTER_USER_FAIL,
	REGISTER_FACEBOOK,
	CHANGE_ROUTE,
	RESET_PASSWORD
} from '../actions/types';

const INIT_STATE = {
	email: '',
	password: '',
	passwordSecond: '',
	user: {},
	loading: false,
	loadingAnon: false,
	loadingFacebook: false
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
				user: action.payload,
				loadingFacebook: false
			};
		case LOGIN_USER_FAIL:
			return { ...state, password: '', loading: false, loadingAnon: false };
		case LOGIN_ANON_USER:
			return { ...state, loadingAnon: true };
		case REGISTER_USER:
		case LOGIN_USER:
			return { ...state, loading: true };
		case REGISTER_FACEBOOK:
			return { ...state, loadingFacebook: true };
		case REGISTER_USER_FAIL:
			return { ...state, loading: false, loadingFacebook: false };
		case RESET_ALL:
		case CHANGE_ROUTE:
		case RESET_PASSWORD:
			return { ...INIT_STATE };
		default:
			return state;
	}
};
