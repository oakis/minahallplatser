import moment from 'moment';
import base64 from 'base-64';
import {handleJsonFetch} from '@helpers';
import {key, secret, url} from '@src/Vasttrafik';
import {deviceId} from '@helpers/device';

const encoded = base64.encode(`${key}:${secret}`);
let localToken = {};
let tokenExpires = moment();

const device = deviceId();

export const getToken = () => {
  tokenWillExpireIn();
  return new Promise((resolve, reject) => {
    if (tokenNeedsRefresh()) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encoded}`,
        },
        body: `grant_type=client_credentials&scope=device_${device}`,
      })
        .then(handleJsonFetch)
        .then(token => {
          saveToken(token);
          resolve(token);
        })
        .catch(() => {
          reject(localToken);
        });
    } else {
      resolve(localToken);
    }
  });
};

const tokenNeedsRefresh = () => {
  window.log(
    'tokenNeedsRefresh()',
    !Object.prototype.hasOwnProperty.call(localToken, 'access_token') ||
      tokenExpires.diff(moment()) / 1000 <= 0,
  );
  return (
    !Object.prototype.hasOwnProperty.call(localToken, 'access_token') ||
    tokenExpires.diff(moment()) / 1000 <= 0
  );
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
