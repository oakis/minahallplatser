import {
	FAVORITE_CREATE,
	FAVORITE_CREATE_FAIL,
	FAVORITE_FETCH_SUCCESS,
	FAVORITE_FETCH_FAIL,
	FAVORITE_DELETE
} from '../actions/types';

const INIT_STATE = {
	busStop: '',
	loading: true
};

export default (state = INIT_STATE, action) => {
	switch (action.type) { 
		case FAVORITE_CREATE:
			return { ...state, ...INIT_STATE, loading: false };
		case FAVORITE_CREATE_FAIL:
			return { ...state, loading: false };
		case FAVORITE_FETCH_SUCCESS:
			return { ...state, list: action.payload, loading: false };
		case FAVORITE_FETCH_FAIL:
			return { ...state, loading: action.payload.loading };
		case FAVORITE_DELETE:
			return { ...state, ...INIT_STATE, loading: false };
		default:
			return state;
	}
};
