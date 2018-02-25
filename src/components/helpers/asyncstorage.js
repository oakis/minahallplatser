import { AsyncStorage } from 'react-native';

export const generateUid = () => {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

/**
 * @param {string} item 
 * @returns {Promise}
 */
export const getStorage = (item) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(item)
        .then((json) => {
            window.log(`getStorage() ${item}: OK`);
            return resolve(JSON.parse(json));
        })
        .catch((e) => {
            window.log(`getStorage() ${item}: FAIL`, e);
            return reject(e);
        });
    });
};

/**
 * @param {string} item 
 * @param {JSON} json 
 * @returns {Promise}
 */
export const setStorage = (item, json) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(item, JSON.stringify(json))
        .then(() => {
            window.log(`setStorage() ${item}: OK`);
            return resolve();
        })
        .catch((e) => {
            window.log(`setStorage() ${item}: FAIL`, e);
            return reject(e);
        });
    });
};
