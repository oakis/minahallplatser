import { PermissionsAndroid, AsyncStorage } from 'react-native';
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
import { handleJsonFetch, getToken, track } from '../components/helpers';
import { serverUrl } from '../Server';

async function checkLocationPermission() {
	return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
}

async function requestLocationPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		)
		if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
			track('Permission GPS', { Accepted: false });
			throw ("Access denied");
		} else {
			track('Permission GPS', { Accepted: true });
		}
	} catch (err) {
		throw err;
	}
}

export const searchChanged = (text) => {
	return {
		type: SEARCH_CHANGED,
		payload: text
	};
};

export const searchStops = ({ busStop }) => {
	return (dispatch) => {
		if (busStop === '') {
			fetch.abort('searchStops');
			return dispatch({
				type: SEARCH_DEPARTURES,
				payload: []
			});
		}
		getToken().finally(({ access_token }) => {
			window.timeStart('searchStops');
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
			fetch(url, config, 'searchStops')
			.finally(handleJsonFetch)
			.then(({ data }) => {
				dispatch({
					type: SEARCH_DEPARTURES,
					payload: data
				});
				dispatch({ type: CLR_ERROR });
				window.timeEnd('searchStops');
			})
			.catch((data) => {
				dispatch({ type: SEARCH_DEPARTURES_FAIL });
				dispatch({ type: ERROR, payload: data });
				window.timeEnd('searchStops');
			});
		});
	};
};

export const getNearbyStops = () => {
	return (dispatch) => {
		try {
			dispatch({ type: CLR_ERROR });
			checkLocationPermission().then(ok => {
				if (!ok) {
					requestLocationPermission().then(() => {
						returnCoords(dispatch);
					}).catch(() => {
						AsyncStorage.getItem('minahallplatser-settings')
							.then((json) => {
								const settings = JSON.parse(json);
								settings['allowedGPS'] = false;
								AsyncStorage.setItem('minahallplatser-settings', JSON.stringify(settings));
							});
						dispatch({ type: SEARCH_BY_GPS_FAIL })
						dispatch({ type: ERROR, payload: 'Du måste tillåta appen att komma åt platstjänster för att kunna hitta hållplatser nära dig.' });
					});
				} else {
					returnCoords(dispatch);
				}
			});
		} catch (e) {
			AsyncStorage.getItem('minahallplatser-settings')
				.then((json) => {
					const settings = JSON.parse(json) || {};
					window.log(settings);
					settings['allowedGPS'] = false;
					AsyncStorage.setItem('minahallplatser-settings', JSON.stringify(settings));
				})
				.catch((e) => {
					window.log(e);
				});
			dispatch({ type: SEARCH_BY_GPS_FAIL })
			dispatch({ type: ERROR, payload: 'Du måste tillåta appen att komma åt platstjänster för att kunna hitta hållplatser nära dig.' });
		}
	};
};

let gpsCount = 0;
const returnCoords = (dispatch) => {
	AsyncStorage.getItem('minahallplatser-settings')
		.then((json) => {
			const settings = JSON.parse(json);
			settings['allowedGPS'] = true;
			AsyncStorage.setItem('minahallplatser-settings', JSON.stringify(settings));
		});
	dispatch({ type: SEARCH_BY_GPS });
	navigator.geolocation.getCurrentPosition((position) => {
		const { longitude, latitude } = position.coords;
		getCoordsSuccess({ dispatch, longitude, latitude });
	},
	(err) => {
		window.log('Error:', err);
		if (Actions.currentScene === 'dashboard' && gpsCount > 5) {
			dispatch({ type: SEARCH_BY_GPS_FAIL });
		} else if (gpsCount < 5) {
			gpsCount++;
			return returnCoords(dispatch);
		}
		gpsCount = 0;
		dispatch({ type: SEARCH_BY_GPS_FAIL })
	},
	{
		enableHighAccuracy: false,
		timeout: 3000,
		maximumAge: 5000
	});
}

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
			dispatch({ type: CLR_ERROR });
			dispatch({ type: SEARCH_BY_GPS_SUCCESS, payload: data });
		})
		.catch((error) => {
			window.timeEnd('getNearbyStops');
			window.log(error);
			dispatch({ type: SEARCH_BY_GPS_FAIL });
		});
	});
};
