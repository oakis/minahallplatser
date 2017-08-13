import base64 from 'base-64';
import firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CHANGED_SECOND,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	LOGIN_USER,
	REGISTER_USER,
	REGISTER_USER_FAIL,
	CHANGE_ROUTE,
	RESET_PASSWORD,
	GET_TOKEN
} from './types';
import { key, secret, url } from '../Vasttrafik';
import { showMessage } from '../components/helpers/message';
import { saveTokenExpires, tokenNeedsRefresh, tokenWillExpireIn } from '../components/helpers/token';

const encoded = base64.encode(`${key}:${secret}`);

export const resetUserPassword = (email) => {
	return (dispatch) => {
		firebase.auth().sendPasswordResetEmail(email).then(() => {
			showMessage('long', `Ett mail för att återställa ditt lösenord har skickats till ${email}.`);
			dispatch({ type: RESET_PASSWORD });
			Actions.auth({ type: 'reset' });
		}, (error) => {
			dispatch({ type: RESET_PASSWORD, payload: getFirebaseError(error) });
		});
	};
};

export const resetRoute = () => {
	return (dispatch) => {
		dispatch({ type: CHANGE_ROUTE });
	};
};

export const emailChanged = (text) => {
	return {
		type: EMAIL_CHANGED,
		payload: text
	};
};

export const passwordChanged = (text) => {
	return {
		type: PASSWORD_CHANGED,
		payload: text
	};
};

export const passwordSecondChanged = (text) => {
	return {
		type: PASSWORD_CHANGED_SECOND,
		payload: text
	};
};

export const registerUser = ({ email, password, passwordSecond }) => {
	return (dispatch) => {
		dispatch({ type: REGISTER_USER });
		if (password !== passwordSecond) {
			dispatch({ type: REGISTER_USER_FAIL, payload: { error: 'Lösenorden matchade inte.' } });
		} else {
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.catch((error) => {
					dispatch({ type: REGISTER_USER_FAIL, payload: { error: getFirebaseError(error) } });
				})
				.then((registered) => {
					if (registered) {
						dispatch({ type: LOGIN_USER });
						firebase.auth().signInWithEmailAndPassword(email, password)
							.then(user => loginUserSuccess(dispatch, user))
							.catch((error) => loginUserFail(dispatch, error));
					}
				});
		}
	};
};

export const loginUser = ({ email, password }) => {
	return (dispatch) => {
		dispatch({ type: LOGIN_USER });
		if (email && password) {
			firebase.auth().signInWithEmailAndPassword(email, password)
			.then(user => loginUserSuccess(dispatch, user))
			.catch(error => loginUserFail(dispatch, error));
		} else if (email && !password) {
			dispatch({ type: LOGIN_USER_FAIL, payload: 'Du måste fylla i ditt lösenord.' });
		} else if (!email && password) {
			dispatch({ type: LOGIN_USER_FAIL, payload: 'Du måste fylla i din email.' });
		} else {
			dispatch({ type: LOGIN_USER_FAIL, payload: 'Du måste fylla i email och lösenord.' });
		}
	};
};

export const autoLogin = (user) => {
	return (dispatch) => {
		if (user.uid === firebase.auth().currentUser.uid) {
			loginUserSuccess(dispatch, user);
			return;
		}
		loginUserFail(dispatch, user);
	};
};

export const getToken = () => (dispatch) => {
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
			}).then((res) => res.json()
			.then((token) => {
				saveTokenExpires(token);
				dispatch({ type: GET_TOKEN, payload: token });
				resolve();
			})
			.catch((error) => {
				console.log(error);
				reject();
			})
			);
		}
		reject();
	});
};

const loginUserSuccess = (dispatch, user) => {
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${encoded}`
		},
		body: `grant_type=client_credentials&scope=device_${user.uid}`
	})
	.then((res) => res.json()
	.then((token) => {
		AsyncStorage.setItem('minahallplatser-user', JSON.stringify(user), () => {
			saveTokenExpires(token);
			dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token } });
			Actions.dashboard({ type: 'reset' });
		});
	})
	.catch((error) => loginUserFail(dispatch, error))
	);
};

const loginUserFail = (dispatch, error) => {
	console.log('loginUserFail', getFirebaseError(error));
	dispatch({ type: LOGIN_USER_FAIL, payload: getFirebaseError(error) });
};

const getFirebaseError = (error) => {
	console.log(error);
	switch (error.code) {
		case 'auth/network-request-failed':
			return 'Det gick inte att ansluta till databasen.';
		case 'auth/invalid-email':
			return 'Var god fyll i en giltig email.';
		case 'auth/email-already-in-use':
			return 'Emailen finns redan registrerad.';
		case 'auth/operation-not-allowed':
			return 'Registreringen är för tillfället stängd.';
		case 'auth/weak-password':
			return 'Lösenordet är för kort, använd minst 6 tecken.';
		case 'auth/user-not-found':
			return 'Det finns ingen användare registrerad med denna email.';
		case 'auth/wrong-password':
			return 'Du fyllde i fel lösenord, var god försök igen.';
		default:
			return 'Något gick snett, kontakta gärna oakismen@gmail.com och berätta vad du gjorde när detta hände. Tack på förhand! :)';
	}
};
