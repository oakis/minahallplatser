import base64 from 'base-64';
import firebase from 'firebase';
import { AsyncStorage, ToastAndroid } from 'react-native';
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
	RESET_PASSWORD
} from './types';
import { key, secret, url } from '../Vasttrafik';

const encoded = base64.encode(`${key}:${secret}`);

export const resetUserPassword = (email) => {
	return (dispatch) => {
		firebase.auth().sendPasswordResetEmail(email).then(() => {
			ToastAndroid.showWithGravity(
				`Ett mail för att återställa ditt lösenord har skickats till ${email}.`,
				ToastAndroid.LONG,
				ToastAndroid.CENTER
			);
			dispatch({ type: RESET_PASSWORD });
			Actions.login({ type: 'reset' });
		}, (error) => {
			console.log('resetUserPassword error: ', error);
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
			let errorMessage;
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.catch((error) => {
					switch (error.code) {
						case 'auth/network-request-failed':
							errorMessage = 'Det gick inte att ansluta till databasen.';
							break;
						case 'auth/invalid-email':
							errorMessage = 'Var god fyll i en giltig email.';
							break;
						case 'auth/email-already-in-use':
							errorMessage = 'Emailen finns redan registrerad.';
							break;
						case 'auth/operation-not-allowed':
							errorMessage = 'Registreringen är för tillfället stängd.';
							break;
						case 'auth/weak-password':
							errorMessage = 'Lösenordet är för kort, använd minst 6 tecken.';
							break;
						default:
							errorMessage = 'Något gick snett, kontakta gärna oakismen@gmail.com och berätta vad du gjorde när detta hände. Tack på förhand! :)';
					}
					dispatch({ type: REGISTER_USER_FAIL, payload: { error: errorMessage } });
				})
				.then((registered) => {
					if (registered) {
						dispatch({ type: LOGIN_USER });
						firebase.auth().signInWithEmailAndPassword(email, password)
							.then(user => loginUserSuccess(dispatch, user))
							.catch(() => loginUserFail(dispatch));
					}
				});
		}
	};
};

export const loginUser = ({ email, password }) => {
	return (dispatch) => {
		dispatch({ type: LOGIN_USER });
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(user => loginUserSuccess(dispatch, user))
			.catch(() => loginUserFail(dispatch));
	};
};

export const autoLogin = (user) => {
	return (dispatch) => {
		if (user.uid === firebase.auth().currentUser.uid) {
			loginUserSuccess(dispatch, user);
		}
		loginUserFail(dispatch);
	};
};

const loginUserSuccess = (dispatch, user) => {
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${encoded}`
		},
		body: `grant_type=client_credentials&scope=device_${user.uid}`
	}).then((res) => res.json()
	.then((token) => {
		AsyncStorage.setItem('minahallplatser-user', JSON.stringify(user), () => {
			dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token } });
			Actions.dashboard();
		});
	})
	.catch((error) => {
		console.log(error);
		loginUserFail(dispatch);
	})
	);
};

const loginUserFail = (dispatch) => {
	dispatch({ type: LOGIN_USER_FAIL });
};
