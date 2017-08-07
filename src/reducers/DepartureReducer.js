import {
	GET_DEPARTURES,
	GET_DEPARTURES_FAIL,
	CLR_DEPARTURES
} from '../actions/types';

const INIT_STATE = {
	departures: [],
	time: '',
	date: '',
	loading: true,
	error: ''
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case GET_DEPARTURES:
			return {
				...state,
				departures: action.payload.departures,
				time: action.payload.time,
				date: action.payload.date,
				loading: false
			};
		case GET_DEPARTURES_FAIL:
			return { ...state, error: action.payload, loading: false };
		case CLR_DEPARTURES:
			return { ...state, ...INIT_STATE };
		default:
			return state;
	}
};
