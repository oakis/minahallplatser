import _ from 'lodash';
import {PermissionsAndroid} from 'react-native';
import geolocation from 'react-native-geolocation-service';
import {
  ALLOWED_GPS,
  SEARCH_CHANGED,
  SEARCH_DEPARTURES,
  SEARCH_DEPARTURES_FAIL,
  SEARCH_BY_GPS,
  SEARCH_BY_GPS_SUCCESS,
  SEARCH_BY_GPS_FAIL,
  ERROR,
  CLR_ERROR,
} from '@types';
import {
  handleJsonFetch,
  getToken,
  track,
  isAndroid,
  handleVasttrafikStops,
} from '@helpers';

const mustAllowGPSMsg =
  'Du måste tillåta appen att komma åt platstjänster samt aktivera hög träffsäkerhet för platstjänster för att kunna hitta hållplatser nära dig.';

async function checkLocationPermission() {
  return await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
}

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      track('Permission GPS', {Accepted: false});
      throw 'Access denied';
    } else {
      track('Permission GPS', {Accepted: true});
    }
  } catch (err) {
    throw err;
  }
}

export const searchChanged = text => {
  return {
    type: SEARCH_CHANGED,
    payload: text,
  };
};

export const searchStops = ({busStop}) => {
  return dispatch => {
    if (busStop === '') {
      // fetch.abort('searchStops');
      return dispatch({
        type: SEARCH_DEPARTURES,
        payload: [],
      });
    }
    getToken().then(response => {
      window.timeStart('searchStops');
      const url = `https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=${busStop}&format=json`;
      const config = {
        method: 'get',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${response.access_token}`,
        },
      };
      window.log(url, config);
      fetch(url, config, 'searchStops')
        .then(handleJsonFetch)
        .then(handleVasttrafikStops)
        .then(data => {
          if (data.length) {
            dispatch({
              type: SEARCH_DEPARTURES,
              payload: data,
            });
            dispatch({type: CLR_ERROR});
            return window.timeEnd('searchStops');
          } else {
            throw 'Din sökning matchade inga hållplatser.';
          }
        })
        .catch(data => {
          dispatch({type: SEARCH_DEPARTURES_FAIL});
          dispatch({type: ERROR, payload: data});
          window.timeEnd('searchStops');
        });
    });
  };
};

export const getNearbyStops = () => {
  return dispatch => {
    try {
      dispatch({type: CLR_ERROR});
      if (isAndroid()) {
        checkLocationPermission().then(ok => {
          if (!ok) {
            requestLocationPermission()
              .then(() => {
                dispatch({
                  type: ALLOWED_GPS,
                  payload: true,
                });
                returnCoords(dispatch);
              })
              .catch(() => {
                dispatch({
                  type: ALLOWED_GPS,
                  payload: false,
                });
                dispatch({type: SEARCH_BY_GPS_FAIL});
                dispatch({type: ERROR, payload: mustAllowGPSMsg});
              });
          } else {
            returnCoords(dispatch);
          }
        });
      } else {
        returnCoords(dispatch);
      }
    } catch (e) {
      dispatch({type: SEARCH_BY_GPS_FAIL});
      dispatch({type: ERROR, payload: mustAllowGPSMsg});
    }
  };
};

let gpsCount = 0;
const returnCoords = dispatch => {
  dispatch({type: SEARCH_BY_GPS});
  geolocation.getCurrentPosition(
    position => {
      window.log('Got coords:', position.coords);
      const {longitude, latitude} = position.coords;
      getCoordsSuccess({dispatch, longitude, latitude});
    },
    err => {
      window.log('Error:', err);
      if (err.code === 4 || err.code === 5) {
        dispatch({
          type: ALLOWED_GPS,
          payload: false,
        });
        dispatch({type: SEARCH_BY_GPS_FAIL});
        return dispatch({type: ERROR, payload: mustAllowGPSMsg});
      }
      if (/* Actions.currentScene === 'dashboard' && */ gpsCount > 5) {
        dispatch({type: SEARCH_BY_GPS_FAIL});
      } else if (gpsCount < 5) {
        gpsCount++;
        return returnCoords(dispatch);
      }
      gpsCount = 0;
      dispatch({type: SEARCH_BY_GPS_FAIL});
    },
    {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 5000,
    },
  );
};

const getCoordsSuccess = ({dispatch, longitude, latitude}) => {
  getToken().then(({access_token}) => {
    window.timeStart('getNearbyStops');
    const url = `https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?originCoordLat=${latitude}&originCoordLong=${longitude}&format=json`;
    const config = {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };
    fetch(url, config, 'getNearbyStops')
      .then(handleJsonFetch)
      .then(handleVasttrafikStops)
      .then(data => {
        gpsCount = 0;
        window.timeEnd('getNearbyStops');
        dispatch({type: CLR_ERROR});
        dispatch({
          type: SEARCH_BY_GPS_SUCCESS,
          payload: _.uniqBy(
            _.filter(data, o => !o.track),
            'name',
          ),
        });
      })
      .catch(error => {
        window.timeEnd('getNearbyStops');
        console.log(error);
        dispatch({type: SEARCH_BY_GPS_FAIL});
      });
  });
};
