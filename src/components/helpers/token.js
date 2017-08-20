import moment from 'moment';
import base64 from 'base-64';
import firebase from 'firebase';
import { handleVasttrafikFetch } from './';
import { key, secret, url } from '../../Vasttrafik';

const encoded = base64.encode(`${key}:${secret}`);
let localToken;
let tokenExpires = moment();

export const getToken = () => {
	tokenWillExpireIn();
	return new Promise((resolve, reject) => {
		const { currentUser } = firebase.auth();
		if (currentUser && tokenNeedsRefresh()) {
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${encoded}`
				},
				body: `grant_type=client_credentials&scope=device_${currentUser.uid}`
			})
			.then(handleVasttrafikFetch)
			.then((token) => {
				saveToken(token);
				resolve(token.access_token);
			})
			.catch((error) => {
				console.log(error);
				reject(localToken.access_token);
			});
		}
		reject(localToken.access_token);
	});
};

const tokenNeedsRefresh = () => {
    console.log('tokenNeedsRefresh()', tokenExpires.diff(moment()) / 1000 < 0);
    return tokenExpires.diff(moment()) / 1000 < 0;
};

const saveToken = (token) => {
    console.log('saveToken()', token);
    localToken = token;
    saveTokenExpires(token);
};

const saveTokenExpires = (token) => {
    tokenExpires = moment().add(token.expires_in, 'seconds');
    console.log('saveTokenExpires()', tokenExpires.format('YYYY-MM-DD HH:mm'));
};

const tokenWillExpireIn = () => {
    console.log('tokenWillExpireIn()', tokenExpires.diff(moment()) / 1000);
    return tokenExpires.diff(moment()) / 1000;
};
