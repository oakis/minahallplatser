import moment from 'moment';
import base64 from 'base-64';
import {handleJsonFetch} from '@helpers';
import {KEY, SECRET, URL} from '@env';
import {deviceId} from '@helpers/device';

const encoded = base64.encode(`${KEY}:${SECRET}`);
let localToken = {};
let tokenExpires = moment();

const device = deviceId();

export const getToken = () => {
  tokenWillExpireIn();
  return new Promise((resolve, reject) => {
    if (tokenNeedsRefresh()) {
      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encoded}`,
        },
        body: `grant_type=client_credentials&scope=device_${device}`,
      })
        .then(handleJsonFetch)
        .then(token => {
          window.log('getToken: OK', token);
          saveToken(token);
          resolve(token);
        })
        .catch(e => {
          window.log('getToken: FAILED', e);
          reject(localToken);
        });
    } else {
      resolve(localToken);
    }
  });
};

const tokenNeedsRefresh = () => {
  const result =
    !Object.prototype.hasOwnProperty.call(localToken, 'access_token') ||
    tokenExpires.diff(moment()) / 1000 <= 0;
  window.log('tokenNeedsRefresh()', result);
  return result;
};

const saveToken = token => {
  window.log('saveToken()', token);
  localToken = token;
  saveTokenExpires(token);
};

const saveTokenExpires = token => {
  tokenExpires = moment().add(token.expires_in, 'seconds');
  window.log('saveTokenExpires()', tokenExpires.format('YYYY-MM-DD HH:mm'));
};

const tokenWillExpireIn = () => {
  window.log('tokenWillExpireIn()', tokenExpires.diff(moment()) / 1000);
};
