import _ from 'lodash';
import {
	SEARCH_CHANGED,
	SEARCH_DEPARTURES,
	SEARCH_DEPARTURES_FAIL,
	SEARCH_BY_GPS,
	SEARCH_BY_GPS_FAIL,
	CLR_SEARCH
} from './types';
import { timeStart, timeEnd, handleVasttrafikFetch } from '../components/helpers';
import { getToken } from './auth';
import { serverUrl } from '../Server';

export const searchChanged = (text) => {
	return {
		type: SEARCH_CHANGED,
		payload: text
	};
};

export const searchDepartures = ({ busStop, access_token }) => {
	return (dispatch) => {
		dispatch(getToken()).finally(() => {
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
			fetch(url, config)
			.then(handleVasttrafikFetch)
			.then(({ success, data }) => {
				if (success) {
					dispatch({
						type: SEARCH_DEPARTURES,
						payload: data
					});
					timeEnd('getDepartures');
				} else {
					dispatch({
						type: SEARCH_DEPARTURES_FAIL,
						payload: data
					});
					timeEnd('getDepartures');
				}
			})
			.catch((data) => {
				dispatch({
					type: SEARCH_DEPARTURES_FAIL,
					payload: data
				});
				timeEnd('getDepartures');
			});
		});
	};
};

export const getNearbyStops = ({ access_token }) => {
	return (dispatch) => {
		dispatch({ type: CLR_SEARCH });
		navigator.geolocation.getCurrentPosition((position) => {
			const { longitude, latitude } = position.coords;
			getCoordsSuccess({ dispatch, longitude, latitude, access_token });
		},
		() => {
			dispatch({
				type: SEARCH_BY_GPS_FAIL,
				payload: { searchError: 'Kunde inte hitta din position.' }
			});
		},
		{
			enableHighAccuracy: false,
			timeout: 7500,
			maximumAge: 20000
		});
	};
};

const getCoordsSuccess = ({ dispatch, longitude, latitude, access_token }) => {
	dispatch(getToken()).finally(() => {
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
		fetch(url, config)
		.then(handleVasttrafikFetch)
		.then(({ success, data }) => {
			timeEnd('getNearbyStops');
			if (success) {
				dispatch({ type: SEARCH_BY_GPS, payload: data });
			} else {
				dispatch({
					type: SEARCH_BY_GPS_FAIL,
					payload: data
				});
			}
		})
		.catch((error) => {
			timeEnd('getNearbyStops');
			console.log(error);
			dispatch({
				type: SEARCH_BY_GPS_FAIL,
				payload: { searchError: 'Kunde inte kontakta Västtrafik. Försök igen senare.' }
			});
		});
	});
};
