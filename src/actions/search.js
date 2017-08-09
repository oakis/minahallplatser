import _ from 'lodash';
import {
	SEARCH_CHANGED,
	SEARCH_DEPARTURES,
	SEARCH_DEPARTURES_FAIL,
	SEARCH_BY_GPS,
	SEARCH_BY_GPS_FAIL,
	CLR_SEARCH
} from './types';

export const searchChanged = (text) => {
	return {
		type: SEARCH_CHANGED,
		payload: text
	};
};

export const searchDepartures = ({ busStop, access_token }) => {
	return (dispatch) => {
		fetch(`https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=${busStop}&format=json`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			})
			.then((data) => data.json())
			.then((list) => {
				dispatch({ type: SEARCH_DEPARTURES, payload: list.LocationList.StopLocation });
			})
			.catch((error) => {
				console.log(error);
				dispatch({
					type: SEARCH_DEPARTURES_FAIL,
					payload: { searchError: 'Kunde inte kontakta Västtrafik. Försök igen senare.' }
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
	fetch(`https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?originCoordLat=${latitude}&originCoordLong=${longitude}&format=json`,
	{
			headers: {
			Authorization: `Bearer ${access_token}`
		}
	})
	.then((data) => data.json())
	.then((list) => {
		console.log('NearbyStops:', list);
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
		console.log(error);
		dispatch({
			type: SEARCH_BY_GPS_FAIL,
			payload: { searchError: 'Kunde inte kontakta Västtrafik. Försök igen senare.' }
		});
	});
};
