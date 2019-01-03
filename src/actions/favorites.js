import firebase from 'react-native-firebase';
import _ from 'lodash';
import store from '../setupStore';
import {
	FAVORITE_CREATE, FAVORITE_CREATE_FAIL, FAVORITE_DELETE,
	FAVORITE_FETCH_SUCCESS, FAVORITE_FETCH_FAIL,
	ERROR,
	LINES_FETCH, LINE_ADD, LINE_REMOVE
} from './types';
import { generateUid, track, getStorage, setStorage } from '../components/helpers';

// Stops

export const favoriteCreate = ({ busStop, id }) => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		if (currentUser.isAnonymous) {
			return getStorage('minahallplatser-favorites').then((data) => {
				const favorites = data || {};
				let exists = false;
				_.forEach(favorites, (item, key) => {
					if (item.id === id) {
						exists = true;
						delete favorites[key];
					}
				});
				if (!exists) {
					favorites[generateUid()] = { busStop, id };
				}
				dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: favorites });
				return setStorage('minahallplatser-favorites', favorites);
			});
		}
		const fbRef = firebase.database().ref(`/users/${currentUser.uid}/favorites`);
		fbRef.orderByChild('id').equalTo(id).once('value', (snapshot) => {
			if (snapshot.val() == null) {
				fbRef.push({ busStop, id })
					.then(() => {
						dispatch({ type: FAVORITE_CREATE });
					}, (error) => {
						window.log('favoriteCreate error: ', error);
						favoriteCreateFail(dispatch);
					});
			} else {
				dispatch(favoriteDelete(id));
			}
		});
	};
};

const favoriteCreateFail = (dispatch) => {
	dispatch({ type: FAVORITE_CREATE_FAIL });
	dispatch({ type: ERROR, payload: 'Kunde inte spara favorit, försök igen senare.' });
};

export const favoriteGet = (currentUser) => {
	if (currentUser) {
		return (dispatch) => {
			getStorage('minahallplatser-favorites').then((favorites) => {
				if (favorites) {
					dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: favorites });
				} else {
					window.log('Did not find favorites locally');
					if (currentUser.isAnonymous) {
						return dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: [] });
					}
				}
				if (!currentUser.isAnonymous) {
					firebase.database().ref(`/users/${currentUser.uid}/favorites`)
					.on('value', snapshot => {
						setStorage('minahallplatser-favorites', snapshot.val());
						window.log('favoriteGet() OK');
						dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: snapshot.val() });
					}, (error) => {
						const isLoggedIn = firebase.auth().currentUser;
						if (isLoggedIn) {
							window.log('favoriteGet() Error: ', error);
							dispatch({
								type: FAVORITE_FETCH_FAIL,
								payload: { loading: false }
							});
							dispatch({ type: ERROR, payload: 'Kunde inte ladda dina favoriter.' });
						}
					});
				}
				getStorage('minahallplatser-lines').then((lines) => {
					if (lines) {
						dispatch({ type: LINES_FETCH, payload: lines });
					} else {
						window.log('Did not find lines locally');
					}
				});
				if (!currentUser.isAnonymous) {
					firebase.database().ref(`/users/${currentUser.uid}/lines`)
					.once('value', snapshot => {
						setStorage('minahallplatser-lines', snapshot.val());
						dispatch({ type: LINES_FETCH, payload: snapshot.val() });
					}, (error) => {
						window.log('lines error: ', error);
						dispatch({ type: ERROR, payload: 'Kunde inte ladda dina sparade linjer.' });
					});
				}
			}).catch((err) => {
				window.log(err);
			});
		};
	}
	return (dispatch) => {
		dispatch({
			type: FAVORITE_FETCH_FAIL,
			payload: { loading: false }
		});
		dispatch({ type: ERROR, payload: 'Kunde inte ladda dina favoriter.' });
	};
};

export const favoriteDelete = (stopId) => {
	window.log('favoriteDelete():', stopId);
	return (dispatch) => {
		const { currentUser } = firebase.auth();
		const ref = firebase.database().ref(`/users/${currentUser.uid}/favorites`);
		ref.once('value', snapshot => {
			const favorites = snapshot.val();
			_.forEach(favorites, (item, key) => {
				if (item.id === stopId) {
					ref.child(key).remove()
						.then(() => {
							window.log('Stop remove was OK');
						})
						.catch((error) => window.log(error));
				}
			});
		});
		dispatch({ type: FAVORITE_DELETE, payload: stopId });
	};
};

// Lines

export const favoriteLineToggle = ({ sname, direction }) => {
	const line = `${sname} ${direction}`;
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		const fbRef = firebase.database().ref(`/users/${currentUser.uid}/lines`);
		let exists = false;
		if (_.includes(store.getState().fav.lines, line)) {
			exists = true;
			track('Favorite Line Remove', { Line: line });
			dispatch({ type: FAVORITE_CREATE_FAIL });
		} else {
			track('Favorite Line Add', { Line: line });
		}
		if (currentUser.isAnonymous) {
			getStorage('minahallplatser-lines').then((storage) => {
				const lines = storage || {};
				if (!exists || !lines) {
					lines[generateUid()] = line;
					setStorage('minahallplatser-lines', lines);
					dispatch({ type: LINE_ADD, payload: line });
				} else {
					const key = _.findKey(lines, (item) => item === line);
					delete lines[key];
					setStorage('minahallplatser-lines', lines);
					dispatch({ type: LINE_REMOVE, payload: line });
				}
			});
		}
		if (!currentUser.isAnonymous && !exists) {
			window.log('favoriteLineToggle push:', line);
			dispatch({ type: LINE_ADD, payload: line });
			fbRef.push(line)
			.catch((error) => {
				window.log('favoriteLineToggle push error:', error);
				favoriteCreateFail(dispatch);
			});
		} else {
			window.log('favoriteLineToggle remove:', line);
			dispatch({ type: LINE_REMOVE, payload: line });
			fbRef.once('value', snapshot => {
				const fbLines = snapshot.val();
				_.forEach(fbLines, (item, key) => {
					if (item === line) {
						fbRef.child(key).remove()
							.then(() => window.log('Line remove was OK'))
							.catch((error) => window.log(error));
					}
				});
			});
		}
	};
};
