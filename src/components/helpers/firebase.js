import fetch from 'react-native-cancelable-fetch';
import { serverUrl } from '../../Server';
import { handleJsonFetch } from './';

export const updateDeparturesCount = (count) => {
    if (__DEV__) {
        return;
    }
    const url = `${serverUrl}/api/firebase/departurescount`;
    const config = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count })
    };
    fetch(url, config, 'updateDeparturesCount')
    .finally(handleJsonFetch)
    .then(({ success, message }) => {
        if (success) {
            window.log('updateDeparturesCount(): OK', message);
        }
        window.log('updateDeparturesCount(): FAILED', message);
    })
    .catch((err) => new Error(err));
};

export const getDeparturesCount = async () => {
    const url = `${serverUrl}/api/firebase/departurescount`;
    const config = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return fetch(url, config, 'getDeparturesCount')
    .finally(handleJsonFetch)
    .then(({ success, departuresCount }) => {
        if (success) {
            window.log('getDeparturesCount(): OK', departuresCount);
            return departuresCount;
        }
        window.log('getDeparturesCount(): FAILED');
    })
    .catch((err) => new Error(err));
};

export const updateStopsCount = () => {
    if (__DEV__) {
        return;
    }
    const url = `${serverUrl}/api/firebase/stopscount`;
    const config = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, config, 'updateStopsCount')
    .finally(handleJsonFetch)
    .then(({ success, message }) => {
        if (success) {
            window.log('updateStopsCount(): OK', message);
        }
        window.log('updateStopsCount(): FAILED', message);
    })
    .catch((err) => new Error(err));
};

export const getStopsCount = async () => {
    const url = `${serverUrl}/api/firebase/stopscount`;
    const config = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return fetch(url, config, 'getStopsCount')
    .finally(handleJsonFetch)
    .then(({ success, stopsCount }) => {
        if (success) {
            window.log('getStopsCount(): OK', stopsCount);
            return stopsCount;
        }
        window.log('getStopsCount(): FAILED');
    })
    .catch((err) => new Error(err));
};
