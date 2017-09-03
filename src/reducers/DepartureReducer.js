import {
	GET_DEPARTURES,
	GET_DEPARTURES_FAIL,
	CLR_DEPARTURES
} from '../actions/types';

const INIT_STATE = {
	departures: [],
	loading: true
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case GET_DEPARTURES:
			return {
				...state,
				departures: action.payload.departures,
				loading: false
			};
		case GET_DEPARTURES_FAIL:
			return { ...state, loading: false };
		case CLR_DEPARTURES:
			return { ...state, ...INIT_STATE };
		default:
			return state;
	}
};
