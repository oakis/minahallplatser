import {firebaseFunctionsUrl} from '@src/Server';
import {handleJsonFetch} from '@helpers';

export const updateDeparturesCount = count => {
  if (__DEV__) {
    return;
  }
  const url = `${firebaseFunctionsUrl}/addDeparturesCount?count=${count}`;
  fetch(url, {}, 'updateDeparturesCount')
    .then(handleJsonFetch)
    .then(({message}) => {
      window.log(`updateDeparturesCount(): OK (${message})`);
    })
    .catch(err => {
      window.log(`updateDeparturesCount(): FAILED' ${err})`);
    });
};

export const getDeparturesCount = () => {
  const url = `${firebaseFunctionsUrl}/getDeparturesCount`;
  return fetch(url, {}, 'getDeparturesCount')
    .then(handleJsonFetch)
    .then(({departuresCount}) => {
      window.log('getDeparturesCount(): OK', departuresCount);
      return departuresCount;
    })
    .catch(err => {
      window.log('getDeparturesCount(): FAILED', err);
    });
};

export const updateStopsCount = () => {
  if (__DEV__) {
    return;
  }
  const url = `${firebaseFunctionsUrl}/addStopsCount`;
  fetch(url, {}, 'updateStopsCount')
    .then(handleJsonFetch)
    .then(({message}) => {
      window.log('updateStopsCount(): OK', message);
    })
    .catch(err => {
      window.log('updateStopsCount(): FAILED', err);
    });
};

export const getStopsCount = () => {
  const url = `${firebaseFunctionsUrl}/getStopsCount`;
  return fetch(url, {}, 'getStopsCount')
    .then(handleJsonFetch)
    .then(({stopsCount}) => {
      window.log('getStopsCount(): OK', stopsCount);
      return stopsCount;
    })
    .catch(err => {
      window.log('getStopsCount(): FAILED', err);
    });
};
