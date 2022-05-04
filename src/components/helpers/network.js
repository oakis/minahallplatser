// import firebase from 'react-native-firebase';
import moment from 'moment';
import _ from 'lodash';
import {isObject} from '@helpers';

export const handleJsonFetch = response => {
  window.log(
    `handleJsonFetch() - Status: ${response.status} - ok: ${response.ok}`,
  );
  if (response.status === 200) {
    return response
      .json()
      .then(data => {
        window.log('handleJsonFetch(): OK', data);
        return data;
      })
      .catch(err => err);
  } else if (response.status === 400) {
    return response.json().then(data => {
      window.log('handleJsonFetch(): Error', data);
      //   firebase.crashlytics().recordError(data.StackTraceString);
      throw data.Message;
    });
  } else if (response.status === 404) {
    return response.json().then(data => {
      window.log('handleJsonFetch(): Error', data);
      throw data.message || data;
    });
  }
  const error =
    response.statusText ||
    response.message ||
    'Det gick inte att ansluta till Mina Hållplatser. Kontrollera din anslutning.';
  window.log('handleJsonFetch(): Error', error, response);
  throw error;
};

export const handleVasttrafikStops = ({LocationList}) => {
  window.log('handleVasttrafikStops()', LocationList);
  if (
    LocationList &&
    LocationList.StopLocation &&
    LocationList.StopLocation.length
  ) {
    return LocationList.StopLocation.map(({id, name, track}) => ({
      id,
      name,
      track,
    })).splice(0, 10);
  } else if (LocationList && isObject(LocationList.StopLocation)) {
    const {id, name, track} = LocationList.StopLocation;
    return [
      {
        id,
        name,
        track,
      },
    ];
  }
  return [];
};

export const handleVasttrafikDepartures = ({DepartureBoard}) => {
  window.log('handleVasttrafikDepartures()', DepartureBoard);
  let departures = [];
  if (DepartureBoard && DepartureBoard.Departure) {
    const rawDepartureList = DepartureBoard.Departure.length
      ? DepartureBoard.Departure
      : [DepartureBoard.Departure];
    const date = DepartureBoard.serverdate || moment().format('YYYY-MM-DD');
    const time = DepartureBoard.servertime || moment().format('HH:mm');
    const now = moment(`${date} ${time}`);
    let mapdDepartures = [];
    rawDepartureList.forEach(item => {
      const [direction, via] = item.direction.split('via');
      const findIndex = _.findIndex(mapdDepartures, {
        name: item.name,
        direction: direction.trim(),
        via: via ? `via ${via.trim()}` : '',
      });

      const timeLeft = moment(`${item.date} ${item.rtTime || item.time}`).diff(
        now,
        'minutes',
      );

      if (findIndex !== -1 && !mapdDepartures[findIndex].timeNext) {
        mapdDepartures[findIndex].timeNext = timeLeft;
        mapdDepartures[findIndex].clockNext = item.rtTime;
      } else if (findIndex === -1) {
        mapdDepartures.push({
          ...item,
          timeNext: null,
          timeLeft: timeLeft <= 0 ? 0 : timeLeft,
          clockNext: null,
          clockLeft: Object.prototype.hasOwnProperty.call(item, 'rtTime')
            ? item.rtTime
            : item.time,
          isLive: Object.prototype.hasOwnProperty.call(item, 'rtTime') === true,
          direction: direction.trim(),
          via: via ? `via ${via.trim()}` : '',
        });
      }
    });
    mapdDepartures = _.orderBy(mapdDepartures, ['timeLeft', 'timeNext']);
    mapdDepartures = _.map(mapdDepartures, (dep, index) => {
      return {...dep, index};
    });
    if (mapdDepartures.length > 0) {
      departures = mapdDepartures;
    }
  }
  return {
    departures,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    error: DepartureBoard.error,
  };
};
