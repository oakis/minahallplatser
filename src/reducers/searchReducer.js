import {
	SEARCH_CHANGED,
	SEARCH_DEPARTURES,
	SEARCH_DEPARTURES_FAIL,
	SEARCH_BY_GPS,
	SEARCH_BY_GPS_FAIL,
	CLR_SEARCH
} from '../actions/types';

const INIT_STATE = {
	busStop: '',
	departureList: [],
	searchError: '',
	stops: [],
	loading: true
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case SEARCH_CHANGED:
			return { ...state, busStop: action.payload };
		case SEARCH_DEPARTURES:
			return { ...state, departureList: action.payload, searchError: '', loading: false };
		case SEARCH_DEPARTURES_FAIL:
			return { ...state, searchError: action.payload.searchError, loading: false };
		case SEARCH_BY_GPS:
			return { ...state, stops: action.payload, searchError: '', loading: false };
		case SEARCH_BY_GPS_FAIL:
			return { ...INIT_STATE, searchError: action.payload.searchError, loading: false };
		case CLR_SEARCH:
			return { ...INIT_STATE };
		default:
			return state;
	}
};
