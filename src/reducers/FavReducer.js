import _ from 'lodash';
import {
	FAVORITE_CREATE, FAVORITE_CREATE_FAIL, FAVORITE_DELETE,
	FAVORITE_FETCH_SUCCESS, FAVORITE_FETCH_FAIL,
	LINES_FETCH, LINE_ADD, LINE_REMOVE
} from '../actions/types';

const INIT_STATE = {
	favorites: [],
	lines: [],
	loading: true
};

export default (state = INIT_STATE, action) => {
	switch (action.type) { 
		case FAVORITE_CREATE:
			return { ...state, loading: false };
		case FAVORITE_CREATE_FAIL:
			return { ...state, loading: false };
		case FAVORITE_FETCH_SUCCESS: {
			return {
				...state,
				favorites: _.values(action.payload),
				loading: false
			};
		}
		case FAVORITE_FETCH_FAIL:
			return { ...state, loading: action.payload.loading };
		case FAVORITE_DELETE:
			return { ...state, loading: false };
		case LINES_FETCH:
			return { ...state, lines: _.values(action.payload) };
		case LINE_ADD:
			return { ...state, lines: [...state.lines, action.payload] };
		case LINE_REMOVE:
			return { ...state, lines: state.lines.filter((e) => e !== action.payload) };
		default:
			return state;
	}
};
