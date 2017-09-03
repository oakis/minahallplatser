import {
	GET_DEPARTURES,
	GET_DEPARTURES_FAIL,
	CLR_DEPARTURES,
	ERROR
} from './types';
import { timeStart, timeEnd, handleVasttrafikFetch, getToken } from '../components/helpers';
import { serverUrl } from '../Server';

export const getDepartures = ({ id }) => {
	timeStart();
	return (dispatch) => {
		getToken()
		.finally(({ access_token }) => {
			const url = `${serverUrl}/api/departures`;
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
			fetch(url, config)
			.finally(handleVasttrafikFetch)
			.then(({ success, data }) => {
				if (success) {
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
			.finally(() => timeEnd('getDepartures'));
		});
	};
};

export const clearDepartures = () => {
	timeStart();
	return (dispatch) => {
		dispatch({ type: CLR_DEPARTURES, payload: [] });
		timeEnd('clearDepartures');
	};
};
