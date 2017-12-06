import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
import {
	SEARCH_CHANGED,
	SEARCH_DEPARTURES,
	SEARCH_DEPARTURES_FAIL,
	SEARCH_BY_GPS,
	SEARCH_BY_GPS_SUCCESS,
	SEARCH_BY_GPS_FAIL,
	CLR_SEARCH,
	ERROR, CLR_ERROR
} from './types';

import { handleJsonFetch, getToken } from '../components/helpers';
import { serverUrl } from '../Server';

export const searchChanged = (text) => {
	return {
		type: SEARCH_CHANGED,
		payload: text
	};
};

export const searchDepartures = ({ busStop }) => {
	return (dispatch) => {
		if (busStop === '') {
			fetch.abort('searchDepartures');
			return dispatch({
				type: SEARCH_DEPARTURES,
				payload: []
			});
		}
		getToken().finally(({ access_token }) => {
			window.timeStart('searchDepartures');
			const url = `${serverUrl}/api/vasttrafik/stops`;
			const config = {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
					'access_token': access_token
				},
				body: `search=${busStop}`
			};
			fetch(url, config, 'searchDepartures')
			.finally(handleJsonFetch)
			.then(({ data }) => {
				dispatch({
					type: SEARCH_DEPARTURES,
					payload: data
				});
				dispatch({ type: CLR_ERROR });
				window.timeEnd('searchDepartures');
			})
			.catch((data) => {
				dispatch({ type: SEARCH_DEPARTURES_FAIL });
				dispatch({ type: ERROR, payload: data });
				window.timeEnd('searchDepartures');
			});
		});
	};
};

let gpsCount = 0;
export const getNearbyStops = () => {
	return (dispatch) => {
		dispatch({ type: SEARCH_BY_GPS });
		navigator.geolocation.getCurrentPosition((position) => {
			const { longitude, latitude } = position.coords;
			getCoordsSuccess({ dispatch, longitude, latitude });
		},
		() => {
			if (Actions.currentScene === 'dashboard' && gpsCount > 5) {
				dispatch({ type: SEARCH_BY_GPS_FAIL });
				dispatch({ type: ERROR, payload: 'Kunde inte hitta din position.' });
			} else {
				gpsCount++;
				return dispatch(getNearbyStops());
			}
		},
		{
			enableHighAccuracy: false,
			timeout: 2000,
			maximumAge: 5000
		});
	};
};

const getCoordsSuccess = ({ dispatch, longitude, latitude }) => {
	getToken().finally(({ access_token }) => {
		window.timeStart('getNearbyStops');
		const url = `${serverUrl}/api/vasttrafik/gps`;
		const config = {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				'access_token': access_token
			},
			body: `longitude=${longitude}&latitude=${latitude}`
		};
		fetch(url, config, 'getNearbyStops')
		.then(handleJsonFetch)
		.then(({ data }) => {
			gpsCount = 0;
			window.timeEnd('getNearbyStops');
			dispatch({ type: SEARCH_BY_GPS_SUCCESS, payload: data });
		})
		.catch((error) => {
			window.timeEnd('getNearbyStops');
			window.log(error);
			dispatch({ type: SEARCH_BY_GPS_FAIL });
			dispatch({ type: ERROR, payload: 'Kunde inte kontakta Västtrafik. Försök igen senare.' });
		});
	});
};
