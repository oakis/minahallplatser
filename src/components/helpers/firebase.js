import fetch from 'react-native-cancelable-fetch';
import { firebaseFunctionsUrl } from '../../Server';
import { handleJsonFetch } from './';

export const updateDeparturesCount = (count) => {
    if (__DEV__) {
        return;
    }
    const url = `${firebaseFunctionsUrl}/addDeparturesCount?count=${count}`;
    fetch(url, {}, 'updateDeparturesCount')
    .finally(handleJsonFetch)
    .then(({ message }) => {
        window.log(`updateDeparturesCount(): OK (${message})`);
    })
    .catch((err) => {
        window.log(`updateDeparturesCount(): FAILED' ${err})`);
    });
};

export const getDeparturesCount = () => {
    const url = `${firebaseFunctionsUrl}/getDeparturesCount`;
    return fetch(url, {}, 'getDeparturesCount')
    .finally(handleJsonFetch)
    .then(({ departuresCount }) => {
        window.log('getDeparturesCount(): OK', departuresCount);
        return departuresCount;
    })
    .catch((err) => {
        window.log('getDeparturesCount(): FAILED', err);
    });
};

export const updateStopsCount = () => {
    if (__DEV__) {
        return;
    }
    const url = `${firebaseFunctionsUrl}/addStopsCount`;
    fetch(url, {}, 'updateStopsCount')
    .finally(handleJsonFetch)
    .then(({ message }) => {
        window.log('updateStopsCount(): OK', message);
    })
    .catch((err) => {
        window.log('updateStopsCount(): FAILED', err);
    });
};

export const getStopsCount = () => {
    const url = `${firebaseFunctionsUrl}/getStopsCount`;
    return fetch(url, {}, 'getStopsCount')
    .finally(handleJsonFetch)
    .then(({ stopsCount }) => {
        window.log('getStopsCount(): OK', stopsCount);
        return stopsCount;
    })
    .catch((err) => {
        window.log('getStopsCount(): FAILED', err);
    });
};
