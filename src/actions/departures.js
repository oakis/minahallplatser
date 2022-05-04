import moment from 'moment';
import {
  GET_DEPARTURES,
  GET_DEPARTURES_FAIL,
  CLR_DEPARTURES,
  ERROR,
  CLR_ERROR,
} from '@types';
import {
  handleJsonFetch,
  getToken,
  updateDeparturesCount,
  handleVasttrafikDepartures,
} from '@helpers';

export const getDepartures = ({id}) => {
  return dispatch => {
    getToken().then(({access_token: accessToken}) => {
      fetchDepartures(dispatch, accessToken, id);
    });
  };
};

export const fetchDepartures = (dispatch, accessToken, id, timeSpan = 90) => {
  window.timeStart('getDepartures()');
  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('HH:mm');
  const url = `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${id}&date=${date}&time=${time}&format=json&timeSpan=${timeSpan}&maxDeparturesPerLine=2&needJourneyDetail=0`;
  const config = {
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  fetch(url, config, 'getDepartures')
    .then(handleJsonFetch)
    .then(handleVasttrafikDepartures)
    .then(data => {
      window.timeEnd('getDepartures()');
      if (data.error && data.error === 'No journeys found' && timeSpan === 90) {
        fetchDepartures(dispatch, accessToken, id, 1440);
        return data;
      } else {
        return data;
      }
    })
    .then(({departures, timestamp}) => {
      updateDeparturesCount(departures.length);
      dispatch({type: CLR_ERROR});
      if (departures.length > 0) {
        dispatch({
          type: GET_DEPARTURES,
          payload: {departures, timestamp},
        });
      }
    })
    .catch(error => {
      window.log('Get departures failed', error);
      dispatch({
        type: GET_DEPARTURES_FAIL,
      });
      dispatch({type: ERROR, payload: error});
    });
};

export const clearDepartures = () => {
  window.timeStart('clearDepartures');
  return dispatch => {
    dispatch({type: CLR_DEPARTURES, payload: []});
    window.timeEnd('clearDepartures');
  };
};
