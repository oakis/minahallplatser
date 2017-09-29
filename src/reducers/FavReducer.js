import _ from 'lodash';
import {
	FAVORITE_CREATE, FAVORITE_CREATE_FAIL, FAVORITE_DELETE,
	FAVORITE_FETCH_SUCCESS, FAVORITE_FETCH_FAIL
} from '../actions/types';

const INIT_STATE = {
	favorites: [],
	lines: [],
	loading: true
};

export default (state = INIT_STATE, action) => {
	switch (action.type) { 
		case FAVORITE_CREATE:
			return { ...state, ...INIT_STATE, loading: false };
		case FAVORITE_CREATE_FAIL:
			return { ...state, loading: false };
		case FAVORITE_FETCH_SUCCESS: {
			return {
				...state,
				favorites: _.filter(action.payload, (v, i) => i !== 'lines'),
				lines: (action.payload.lines) ? _.values(action.payload.lines) : [],
				loading: false
			};
		}
		case FAVORITE_FETCH_FAIL:
			return { ...state, loading: action.payload.loading };
		case FAVORITE_DELETE:
			return { ...state, ...INIT_STATE, loading: false };
		default:
			return state;
	}
};
