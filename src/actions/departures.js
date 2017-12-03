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
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
					'access_token': access_token
				},
				body: `id=${id}`
			};
			console.log(url);
			fetch(url, config, 'getDepartures')
			.finally(handleJsonFetch)
			.then(({ departures, timestamp }) => {
				//updateDeparturesCount(data.departures.length);
				dispatch({ type: CLR_ERROR });
				dispatch({
					type: GET_DEPARTURES,
					payload: { departures, timestamp }
				});
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
