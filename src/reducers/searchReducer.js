import {
	SEARCH_CHANGED,
	SEARCH_DEPARTURES,
	SEARCH_DEPARTURES_FAIL,
	SEARCH_BY_GPS,
	SEARCH_BY_GPS_SUCCESS,
	SEARCH_BY_GPS_FAIL,
	CLR_SEARCH
} from '../actions/types';

const INIT_STATE = {
	busStop: '',
	departureList: [],
	stops: [],
	loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case SEARCH_CHANGED:
			return { ...state, busStop: action.payload, loading: true };
		case SEARCH_DEPARTURES:
			return { ...state, departureList: action.payload, loading: false };
		case SEARCH_DEPARTURES_FAIL:
			return { ...state, departureList: [], loading: false };
		case SEARCH_BY_GPS:
			return { ...state, loading: true };
		case SEARCH_BY_GPS_SUCCESS:
			return { ...state, stops: action.payload, loading: false };
		case SEARCH_BY_GPS_FAIL:
			return { ...INIT_STATE, loading: false };
		case CLR_SEARCH:
			return { ...state, departureList: [], loading: false };
		default:
			return state;
	}
};
