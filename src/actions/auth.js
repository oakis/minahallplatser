import firebase from 'react-native-firebase';
import moment from 'moment';
import _ from 'lodash';
import Mixpanel from 'react-native-mixpanel';
import { Actions } from 'react-native-router-flux';
import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CHANGED_SECOND,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	LOGIN_USER,
	LOGIN_ANON_USER,
	REGISTER_USER,
	REGISTER_USER_FAIL,
	CHANGE_ROUTE,
	RESET_PASSWORD,
	ERROR,
	REGISTER_FACEBOOK
} from './types';
import { showMessage, getToken, track, globals, setStorage } from '../components/helpers';
import { store } from '../App';
import { getSettings } from './';

export const resetUserPassword = (email) => {
	if (email.length === 0) {
		return { 
			type: ERROR,
			payload: getFirebaseError({ code: 'auth/invalid-email' }),
		};
	}
	return (dispatch) => {
		return firebase.auth().sendPasswordResetEmail(email)
		.then(() => {
			showMessage('long', `Ett mail för att återställa ditt lösenord har skickats till ${email}.`);
			dispatch({ type: RESET_PASSWORD });
			Actions.login();
		}).catch((error) => {
			dispatch({ type: RESET_PASSWORD });
			dispatch({ type: ERROR, payload: getFirebaseError(error) });
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
	return async (dispatch) => {
		dispatch({ type: REGISTER_USER });
		if (password !== passwordSecond) {
			dispatch({ type: REGISTER_USER_FAIL });
			dispatch({ type: ERROR, payload: 'Lösenorden matchade inte.' });
		} else if (firebase.auth().currentUser && firebase.auth().currentUser.isAnonymous) {
			try {
				track('Register', { type: 'From Anonymous' });
				const credential = firebase.auth.EmailAuthProvider.credential(email, password);
				await firebase.auth().currentUser.linkWithCredential(credential);
				dispatch({ type: LOGIN_USER });
				const user = await firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password);
				const { favorites, lines } = store.getState().fav;
				const fbUser = firebase.database().ref(`/users/${user.uid}`);
				_.forEach(favorites, (favorite) => {
					fbUser.child('favorites').push(favorite);
				});
				_.forEach(lines, (line) => {
					fbUser.child('lines').push(line);
				});
				loginUserSuccess(dispatch, user);
			} catch (error) {
				loginUserFail(dispatch, error);
			}
		} else {
			track('Register', { type: 'New Account' });
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.catch((error) => {
					dispatch({ type: REGISTER_USER_FAIL });
					dispatch({ type: ERROR, payload: getFirebaseError(error) });
				})
				.then((registered) => {
					if (registered) {
						dispatch({ type: LOGIN_USER });
						firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
							.then(user => loginUserSuccess(dispatch, user))
							.catch((error) => loginUserFail(dispatch, error));
					}
				});
		}
	};
};

export const registerFacebook = (credential) => {
	return (dispatch) => {
		dispatch({ type: REGISTER_FACEBOOK });
		if (firebase.auth().currentUser && firebase.auth().currentUser.isAnonymous) {
			track('Register', { type: 'From Anonymous' });
			firebase.auth().currentUser.linkWithCredential(credential).then(() => {
				globals.isLoggingIn = true;
				firebase.auth().signInAndRetrieveDataWithCredential(credential)
					.then(user => {
						const { favorites, lines } = store.getState().fav;
						const fbUser = firebase.database().ref(`/users/${user.uid}`);
						_.forEach(favorites, (favorite) => {
							fbUser.child('favorites').push(favorite);
						});
						_.forEach(lines, (line) => {
							fbUser.child('lines').push(line);
						});
						loginUserSuccess(dispatch, user);
					})
					.catch((error) => loginUserFail(dispatch, error));
			}, (error) => {
				dispatch({ type: REGISTER_USER_FAIL });
				loginUserFail(dispatch, error);
			});
		} else {
			track('Register', { type: 'New Account' });
			firebase.auth().signInAndRetrieveDataWithCredential(credential)
			.then(user => window.log(`Facebook account ${user.email} was successfully logged in.`))
			.catch(error => window.log('Facebook account failed:', error));
		}
	};
};

export const loginUser = ({ email, password }) => {
	return (dispatch) => {
		dispatch({ type: LOGIN_USER });
		if (email && password) {
			globals.isLoggingIn = true;
			firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
			.then(user => window.log(`Email account ${user.email} was successfully logged in.`))
			.catch(error => loginUserFail(dispatch, error));
		} else if (email && !password) {
			dispatch({ type: LOGIN_USER_FAIL });
			dispatch({ type: ERROR, payload: 'Du måste fylla i ditt lösenord.' });
		} else if (!email && password) {
			dispatch({ type: LOGIN_USER_FAIL });
			dispatch({ type: ERROR, payload: 'Du måste fylla i din email.' });
		} else {
			dispatch({ type: LOGIN_USER_FAIL });
			dispatch({ type: ERROR, payload: 'Du måste fylla i email och lösenord.' });
		}
	};
};

export const loginAnonUser = () => {
	return (dispatch) => {
		dispatch({ type: LOGIN_ANON_USER });
		firebase.auth().signInAnonymouslyAndRetrieveData()
		.then(user => loginUserSuccess(dispatch, user))
		.catch(error => loginUserFail(dispatch, error));
	};
};

export const autoLogin = (user) => {
	return (dispatch) => {
		if (user.uid === firebase.auth().currentUser.uid) {
			return loginUserSuccess(dispatch, user);
		}
		loginUserFail(dispatch, user);
	};
};

const loginUserSuccess = (dispatch, user) => {
	const actualUser = user && user.additionalUserInfo && user.additionalUserInfo.isNewUser ? user.user : user;
	getToken().finally(() => {
		Mixpanel.identify(actualUser.uid);
		if (!user.isAnonymous) {
			Mixpanel.set({ $email: actualUser.email });
		}
		const fbUser = firebase.database().ref(`/users/${actualUser.uid}`);
		fbUser.update({
			lastLogin: moment().format(),
			isAnonymous: actualUser.isAnonymous,
			email: actualUser.isAnonymous ? '-' : actualUser.email,
			created: moment(actualUser.metadata.creationTime).format(),
			provider: actualUser.isAnonymous ? 'Anonymous' : actualUser.providerId
		});
		setStorage('minahallplatser-user', actualUser).then(() => {
			dispatch({ type: LOGIN_USER_SUCCESS, payload: actualUser });
			getSettings(dispatch).then(() => {
				globals.isLoggingIn = false;
				Actions.dashboard({ type: 'reset' });
			});
		});
	});
};

const loginUserFail = (dispatch, error) => {
	if (error.code) {
		dispatch({ type: LOGIN_USER_FAIL });
		dispatch({ type: ERROR, payload: getFirebaseError(error) });
	} else {
		dispatch({ type: LOGIN_USER_FAIL });
		dispatch({ type: ERROR, payload: getFirebaseError({ code: 'auth/network-request-failed' }) });
	}
	if (Actions.currentScene === 'splash') {
		Actions.login();
	}
};

export const getFirebaseError = (error) => {
	window.log('Firebase Error:', error);
	switch (error.code) {
		case 'auth/network-request-failed':
			return 'Det gick inte att ansluta till Mina Hållplatser. Kontrollera din anslutning.';
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
		case 'auth/credential-already-in-use':
			return `${error.email} är redan registrerad med en annan typ av konto.`;
		default:
			return 'Något gick snett, kontakta gärna oakismen@gmail.com och berätta vad du gjorde när detta hände. Tack på förhand! :)';
	}
};
