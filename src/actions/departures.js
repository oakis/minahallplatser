import moment from 'moment';
import _ from 'lodash';
import {
	GET_DEPARTURES,
	GET_DEPARTURES_FAIL,
	CLR_DEPARTURES
} from './types';

export const getDepartures = ({ id, access_token, time, date }) => {
	const checkStart = moment();
	const url = `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${id}&date=${date}&time=${time}&format=json&timeSpan=90&maxDeparturesPerLine=2&needJourneyDetail=0`;
	return (dispatch) => {
		fetch(url, { headers: { Authorization: `Bearer ${access_token}` } })
			.then((data) => data.json())
			.catch((error) => {
				console.log('DepartureBoard error: ', error);
				dispatch({
					type: GET_DEPARTURES_FAIL,
					payload: 'Kunde inte hämta avgångar från Västtrafik.'
				});
			})
			.then((departures) => {
				// console.log('Fetch took ', moment().diff(checkStart), ' milliseconds.');
				if (departures.DepartureBoard) {
					if (departures.DepartureBoard.Departure) {
						const serverdate = departures.DepartureBoard.serverdate || moment().format('YYYY-MM-DD');
						const servertime = departures.DepartureBoard.servertime || moment().format('HH:mm');
						const now = moment(
							`${serverdate} ${servertime}`
						);
						let mapdDepartures = [];
						departures.DepartureBoard.Departure.forEach((item) => {
							const findIndex = _.findIndex(mapdDepartures,
								{ name: item.name, direction: item.direction }
							);
							const timeDeparture = moment(
								`${serverdate} ${item.rtTime || item.time}`
							);
							const timeLeft = timeDeparture.diff(now, 'minutes');
							if (findIndex !== -1 && !mapdDepartures[findIndex].nextStop) {
								mapdDepartures[findIndex].nextStop = timeLeft;
							} else if (findIndex === -1) {
								mapdDepartures.push({ ...item, nextStop: null, timeLeft: (timeLeft <= 0) ? 0 : timeLeft });
							} else {
								console.log('wtf?: ', item);
							}
						});

						mapdDepartures = _.orderBy(mapdDepartures, ['timeLeft', 'nextStop']);
						let listIndex = 0;
						mapdDepartures.forEach((dep) => {
							dep.index = listIndex;
							listIndex++;
						});
						// console.log('Full request took ', moment().diff(checkStart), ' milliseconds.');

						dispatch({
							type: GET_DEPARTURES,
							payload: {
								departures: mapdDepartures,
								time: servertime,
								date: serverdate
							}
						});
					} else {
						dispatch({
							type: GET_DEPARTURES_FAIL,
							payload: 'Inga avgångar hittades på denna hållplats.'
						});
					}
				} else {
					dispatch({
						type: GET_DEPARTURES_FAIL,
						payload: 'Något gick snett. Försök igen om en stund.'
					});
				}
			}, (error) => {
				console.log('Could not get departures: ', error);
				dispatch({
					type: GET_DEPARTURES_FAIL,
					payload: 'Kunde inte hämta avgångar från Västtrafik.'
				});
			});
	};
};

export const clearDepartures = () => {
	return (dispatch) => {
		dispatch({ type: CLR_DEPARTURES, payload: null });
	};
};
