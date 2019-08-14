import fetch from 'react-native-cancelable-fetch';
import moment from 'moment';
import {
	GET_DEPARTURES,
	GET_DEPARTURES_FAIL,
	CLR_DEPARTURES,
	ERROR, CLR_ERROR
} from './types';
import { handleJsonFetch, getToken, updateDeparturesCount, handleVasttrafikDepartures } from '../components/helpers';

export const getDepartures = ({ id }) => {
	return (dispatch) => {
		getToken()
		.finally(({ access_token: accessToken }) => {
			window.timeStart('getDepartures()');
			const date = moment().format('YYYY-MM-DD');
			const time = moment().format('HH:mm');
			const url = `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${id}&date=${date}&time=${time}&format=json&timeSpan=90&maxDeparturesPerLine=2&needJourneyDetail=0`;
			const config = {
				method: 'get',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
			};
			fetch(url, config, 'getDepartures')
			.finally(handleJsonFetch)
			.then(handleVasttrafikDepartures)
			.then(({ departures, timestamp }) => {
				updateDeparturesCount(departures.length);
				dispatch({ type: CLR_ERROR });
				dispatch({
					type: GET_DEPARTURES,
					payload: { departures, timestamp }
				});
			})
			.catch((error) => {
				window.log('Get departures failed', error)
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
