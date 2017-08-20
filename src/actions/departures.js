import {
	GET_DEPARTURES,
	GET_DEPARTURES_FAIL,
	CLR_DEPARTURES
} from './types';
import { timeStart, timeEnd, handleVasttrafikFetch, getToken } from '../components/helpers';
import { serverUrl } from '../Server';

export const getDepartures = ({ id }) => {
	timeStart();
	return (dispatch) => {
		getToken().finally((token) => {
			const url = `${serverUrl}/api/departures`;
			const config = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
					access_token: token
				})
			};
			fetch(url, config)
			.then(handleVasttrafikFetch)
			.then(({ success, data }) => {
				if (success) {
					dispatch({
						type: GET_DEPARTURES,
						payload: data
					});
					timeEnd('getDepartures');
				} else {
					dispatch({
						type: GET_DEPARTURES_FAIL,
						payload: data
					});
					timeEnd('getDepartures');
				}
			})
			.catch((data) => {
				dispatch({
					type: GET_DEPARTURES_FAIL,
					payload: data
				});
				timeEnd('getDepartures');
			});
		});
	};
};

export const clearDepartures = () => {
	timeStart();
	return (dispatch) => {
		dispatch({ type: CLR_DEPARTURES, payload: null });
		timeEnd('clearDepartures');
	};
};
