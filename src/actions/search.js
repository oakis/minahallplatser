import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
import {
	SEARCH_CHANGED,
	SEARCH_DEPARTURES,
	SEARCH_DEPARTURES_FAIL,
	SEARCH_BY_GPS,
	SEARCH_BY_GPS_FAIL,
	CLR_SEARCH,
	ERROR, CLR_ERROR
} from './types';

import { timeStart, timeEnd, handleVasttrafikFetch, getToken } from '../components/helpers';
import { serverUrl } from '../Server';

export const searchChanged = (text) => {
	return {
		type: SEARCH_CHANGED,
		payload: text
	};
};

export const searchDepartures = ({ busStop }) => {
	return (dispatch) => {
		getToken().finally(({ access_token }) => {
			timeStart();
			const url = `${serverUrl}/api/search`;
			const config = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					busStop,
					access_token
				})
			};
			fetch(url, config, 'searchDepartures')
			.then(handleVasttrafikFetch)
			.then(({ success, data }) => {
				if (success) {
					dispatch({
						type: SEARCH_DEPARTURES,
						payload: data
					});
					dispatch({ type: CLR_ERROR });
					timeEnd('getDepartures');
				} else {
					dispatch({ type: SEARCH_DEPARTURES_FAIL });
					dispatch({ type: ERROR, payload: data });
					timeEnd('getDepartures');
				}
			})
			.catch((data) => {
				dispatch({ type: SEARCH_DEPARTURES_FAIL });
				dispatch({ type: ERROR, payload: data });
				timeEnd('getDepartures');
			});
		});
	};
};

export const getNearbyStops = () => {
	return (dispatch) => {
		dispatch({ type: CLR_SEARCH });
		navigator.geolocation.getCurrentPosition((position) => {
			const { longitude, latitude } = position.coords;
			getCoordsSuccess({ dispatch, longitude, latitude });
		},
		() => {
			if (Actions.currentScene === 'listNearbyStops') {
				dispatch({ type: SEARCH_BY_GPS_FAIL });
				dispatch({ type: ERROR, payload: 'Kunde inte hitta din position.' });
			}
		},
		{
			enableHighAccuracy: false,
			timeout: 7500,
			maximumAge: 20000
		});
	};
};

const getCoordsSuccess = ({ dispatch, longitude, latitude }) => {
	getToken().finally(({ access_token }) => {
		timeStart();
		const url = `${serverUrl}/api/gps`;
		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				longitude,
				latitude,
				access_token
			})
		};
		fetch(url, config, 'getNearbyStops')
		.then(handleVasttrafikFetch)
		.then(({ success, data }) => {
			timeEnd('getNearbyStops');
			if (success) {
				dispatch({ type: SEARCH_BY_GPS, payload: data });
			} else {
				dispatch({ type: SEARCH_BY_GPS_FAIL	});
				dispatch({ type: ERROR, payload: data });
			}
		})
		.catch((error) => {
			timeEnd('getNearbyStops');
			window.log(error);
			dispatch({ type: SEARCH_BY_GPS_FAIL });
			dispatch({ type: ERROR, payload: 'Kunde inte kontakta Västtrafik. Försök igen senare.' });
		});
	});
};
