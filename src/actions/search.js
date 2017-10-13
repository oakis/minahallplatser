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
			dispatch({
				type: SEARCH_DEPARTURES,
				payload: []
			});
		}
		getToken().finally(({ access_token }) => {
			window.timeStart('searchDepartures');
			const url = `${serverUrl}/api/vasttrafik/search`;
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
			.finally(handleJsonFetch)
			.then(({ success, data }) => {
				if (success) {
					dispatch({
						type: SEARCH_DEPARTURES,
						payload: data
					});
					dispatch({ type: CLR_ERROR });
					window.timeEnd('searchDepartures');
				} else {
					dispatch({ type: SEARCH_DEPARTURES_FAIL });
					dispatch({ type: ERROR, payload: data });
					window.timeEnd('searchDepartures');
				}
			})
			.catch((data) => {
				dispatch({ type: SEARCH_DEPARTURES_FAIL });
				dispatch({ type: ERROR, payload: data });
				window.timeEnd('searchDepartures');
			});
		});
	};
};

export const getNearbyStops = () => {
	return (dispatch) => {
		dispatch({ type: CLR_SEARCH });
		dispatch({ type: SEARCH_BY_GPS });
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
		window.timeStart('getNearbyStops');
		const url = `${serverUrl}/api/vasttrafik/gps`;
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
		.then(handleJsonFetch)
		.then(({ success, data }) => {
			window.timeEnd('getNearbyStops');
			if (success) {
				dispatch({ type: SEARCH_BY_GPS_SUCCESS, payload: data });
			} else {
				dispatch({ type: SEARCH_BY_GPS_FAIL	});
				dispatch({ type: ERROR, payload: data });
			}
		})
		.catch((error) => {
			window.timeEnd('getNearbyStops');
			window.log(error);
			dispatch({ type: SEARCH_BY_GPS_FAIL });
			dispatch({ type: ERROR, payload: 'Kunde inte kontakta Västtrafik. Försök igen senare.' });
		});
	});
};
