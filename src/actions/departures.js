import fetch from 'react-native-cancelable-fetch';
import {
	GET_DEPARTURES,
	GET_DEPARTURES_FAIL,
	CLR_DEPARTURES,
	ERROR, CLR_ERROR
} from './types';
import { handleJsonFetch, getToken, updateDeparturesCount } from '../components/helpers';
import { serverUrl } from '../Server';

export const getDepartures = ({ id }) => {
	return (dispatch) => {
		getToken()
		.finally(({ access_token }) => {
			window.timeStart('getDepartures()');
			const url = `${serverUrl}/api/vasttrafik/departures`;
			const config = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
					access_token
				})
			};
			fetch(url, config, 'getDepartures')
			.finally(handleJsonFetch)
			.then(({ success, data }) => {
				if (success) {
					updateDeparturesCount(data.departures.length);
					dispatch({ type: CLR_ERROR });
					dispatch({
						type: GET_DEPARTURES,
						payload: data
					});
				} else {
					dispatch({
						type: GET_DEPARTURES_FAIL
					});
					dispatch({ type: ERROR, payload: data });
				}
			})
			.catch((error) => {
				dispatch({
					type: GET_DEPARTURES_FAIL
				});
				dispatch({ type: ERROR, payload: error });
			})
			.finally(() => window.timeEnd('getDepartures()'));
		});
	};
};

export const clearDepartures = () => {
	window.timeStart('clearDepartures');
	return (dispatch) => {
		dispatch({ type: CLR_DEPARTURES, payload: [] });
		window.timeEnd('clearDepartures');
	};
};
