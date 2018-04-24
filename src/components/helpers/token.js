import moment from 'moment';
import base64 from 'base-64';
import firebase from 'react-native-firebase';
import fetch from 'react-native-cancelable-fetch';
import { handleJsonFetch } from './';
import { key, secret, url } from '../../Vasttrafik';

const encoded = base64.encode(`${key}:${secret}`);
let localToken = {};
let tokenExpires = moment();

export const getToken = () => {
	tokenWillExpireIn();
	return new Promise((resolve, reject) => {
		const { currentUser } = firebase.auth();
		if (!currentUser) {
			window.log('firebase not logged in', firebase.auth());
			return;
		}
		if (tokenNeedsRefresh()) {
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${encoded}`
				},
				body: `grant_type=client_credentials&scope=device_${currentUser.uid}`
			}, 'getToken')
			.then(handleJsonFetch)
			.then((token) => {
				saveToken(token);
				resolve(token);
			})
			.catch(() => {
				reject(localToken);
			});
		} else {
			reject(localToken);
		}
	});
};

const tokenNeedsRefresh = () => {
    window.log('tokenNeedsRefresh()', !Object.prototype.hasOwnProperty.call(localToken, 'access_token') || tokenExpires.diff(moment()) / 1000 <= 0);
    return !Object.prototype.hasOwnProperty.call(localToken, 'access_token') || tokenExpires.diff(moment()) / 1000 <= 0;
};

const saveToken = (token) => {
    window.log('saveToken()', token);
    localToken = token;
	saveTokenExpires(token);
};

const saveTokenExpires = (token) => {
    tokenExpires = moment().add(token.expires_in, 'seconds');
    window.log('saveTokenExpires()', tokenExpires.format('YYYY-MM-DD HH:mm'));
};

const tokenWillExpireIn = () => {
    window.log('tokenWillExpireIn()', tokenExpires.diff(moment()) / 1000);
};
