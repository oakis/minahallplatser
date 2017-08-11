import _ from 'lodash';
import {
	SEARCH_CHANGED,
	SEARCH_DEPARTURES,
	SEARCH_DEPARTURES_FAIL,
	SEARCH_BY_GPS,
	SEARCH_BY_GPS_FAIL,
	CLR_SEARCH
} from './types';
import { timeStart, timeEnd } from '../components/helpers/time';

export const searchChanged = (text) => {
	return {
		type: SEARCH_CHANGED,
		payload: text
	};
};

export const searchDepartures = ({ busStop, accessToken }) => {
	return (dispatch) => {
		timeStart();
		fetch(`https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=${busStop}&format=json`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			})
			.then((data) => data.json())
			.then((list) => {
				timeEnd('searchDepartures');
				dispatch({ type: SEARCH_DEPARTURES, payload: list.LocationList.StopLocation });
			})
			.catch((error) => {
				timeEnd('searchDepartures');
				console.log(error);
				dispatch({
					type: SEARCH_DEPARTURES_FAIL,
					payload: { searchError: 'Kunde inte kontakta Västtrafik. Försök igen senare.' }
				});
			});
	};
};

export const getNearbyStops = ({ accessToken }) => {
	return (dispatch) => {
		dispatch({ type: CLR_SEARCH });
		navigator.geolocation.getCurrentPosition((position) => {
			const { longitude, latitude } = position.coords;
			getCoordsSuccess({ dispatch, longitude, latitude, accessToken });
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

const getCoordsSuccess = ({ dispatch, longitude, latitude, accessToken }) => {
	timeStart();
	fetch(`https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?originCoordLat=${latitude}&originCoordLong=${longitude}&format=json`,
	{
			headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
	.then((data) => data.json())
	.then((list) => {
		timeEnd('getNearbyStops');
		console.log('getNearbyStops:', list);
		if (!list.LocationList.StopLocation) {
			dispatch({
				type: SEARCH_BY_GPS_FAIL,
				payload: { searchError: 'Hittade inga hållplatser nära dig.' }
			});
		} else {
			const mapdList = _.uniqBy(_.filter(list.LocationList.StopLocation, (o) => !o.track), 'name');
			dispatch({ type: SEARCH_BY_GPS, payload: mapdList });
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
};
