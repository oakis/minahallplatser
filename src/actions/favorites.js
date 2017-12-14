import firebase from 'firebase';
import _ from 'lodash';
import { AsyncStorage } from 'react-native';
import { store } from '../App';
import {
	FAVORITE_CREATE, FAVORITE_CREATE_FAIL, FAVORITE_DELETE,
	FAVORITE_FETCH_SUCCESS, FAVORITE_FETCH_FAIL,
	ERROR,
	LINES_FETCH, LINE_ADD, LINE_REMOVE
} from './types';
import { generateUid, track } from '../components/helpers';

// Stops

export const favoriteCreate = ({ busStop, id }) => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		if (currentUser.isAnonymous) {
			return AsyncStorage.getItem('minahallplatser-favorites').then((dataJson) => {
				const favorites = JSON.parse(dataJson) || {};
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
				dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: favorites })
				return AsyncStorage.setItem('minahallplatser-favorites', JSON.stringify(favorites));
			});
		} else {
			const fbRef = firebase.database().ref(`/users/${currentUser.uid}/favorites`);
			fbRef.orderByChild('id').equalTo(id).once('value', (snapshot) => {
				if (snapshot.val() == null) {
					fbRef.push({ busStop, id })
						.then(() => {
							track('Favorite Stop Add', { Stop: busStop });
							dispatch({ type: FAVORITE_CREATE });
						}, (error) => {
							window.log('favoriteCreate error: ', error);
							favoriteCreateFail(dispatch);
						});
				} else {
					dispatch(favoriteDelete(id));
				}
			});
		}
	};
};

const favoriteCreateFail = (dispatch) => {
	dispatch({ type: FAVORITE_CREATE_FAIL });
	dispatch({ type: ERROR, payload: 'Kunde inte spara favorit, försök igen senare.' });
};

export const favoriteGet = (currentUser) => {
	if (currentUser) {
		return (dispatch) => {
			AsyncStorage.getItem('minahallplatser-favorites').then((dataJson) => {
				const favorites = JSON.parse(dataJson);
				if (favorites) {
					dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: favorites });
				} else {
					window.log('Did not find favorites locally');
					if (currentUser.isAnonymous) {
						return dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: [] })
					}
				}
				if (!currentUser.isAnonymous) {
					firebase.database().ref(`/users/${currentUser.uid}/favorites`)
					.on('value', snapshot => {
						AsyncStorage.setItem('minahallplatser-favorites', JSON.stringify(snapshot.val()));
						dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: snapshot.val() });
					}, (error) => {
						const isLoggedIn = firebase.auth().currentUser;
						if (isLoggedIn) {
							window.log('favoriteGet error: ', error);
							dispatch({
								type: FAVORITE_FETCH_FAIL,
								payload: { loading: false }
							});
							dispatch({ type: ERROR, payload: 'Kunde inte ladda dina favoriter.' });
						}
					});
				}
				AsyncStorage.getItem('minahallplatser-lines').then((localLines) => {
					const lines = JSON.parse(localLines);
					if (lines) {
						dispatch({ type: LINES_FETCH, payload: lines });
					} else {
						window.log('Did not find lines locally');
					}
				});
				if (!currentUser.isAnonymous) {
					firebase.database().ref(`/users/${currentUser.uid}/lines`)
					.once('value', snapshot => {
						AsyncStorage.setItem('minahallplatser-lines', JSON.stringify(snapshot.val()));
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
	return async (dispatch) => {
		const { currentUser } = firebase.auth();
		const ref = firebase.database().ref(`/users/${currentUser.uid}/favorites`);
		let removeByKey;
		await ref.on('value', async snapshot => {
			const favorites = await snapshot.val();
			_.forEach(favorites, (item, key) => {
				if (item.id === stopId) {
					track('Favorite Stop Remove', { Stop: item.busStop });
					removeByKey = ref.child(key);
				}
			});
		});
		removeByKey.remove()
			.then(() => {
				window.log('Removed entry');
				dispatch({ type: FAVORITE_DELETE, payload: stopId });
			})
			.catch((error) => window.log(error));
	};
};

// Lines

export const favoriteLineToggle = ({ sname, direction }) => {
	const line = `${sname} ${direction}`;
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		const fbRef = firebase.database().ref(`/users/${currentUser.uid}/lines`);
		let exists = false;
		let fbKey;
		if (_.includes(store.getState().fav.lines, line)) {
			exists = true;
			track('Favorite Line Remove', { Line: line });
			dispatch({ type: FAVORITE_CREATE_FAIL });
		} else {
			track('Favorite Line Add', { Line: line });
		}
		if (currentUser.isAnonymous) {
			AsyncStorage.getItem('minahallplatser-lines').then((localLines) => {
				const lines = JSON.parse(localLines) || {};
				if (!exists || !lines) {
					lines[generateUid()] = line;
					AsyncStorage.setItem('minahallplatser-lines', JSON.stringify(lines));
					dispatch({ type: LINE_ADD, payload: line });
				} else {
					const key = _.findKey(lines, (item) => item == line);
					delete lines[key];
					AsyncStorage.setItem('minahallplatser-lines', JSON.stringify(lines));
					dispatch({ type: LINE_REMOVE, payload: line });
				}
			});
		} else {
			if (!exists) {
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
							fbKey = fbRef.child(key);
						}
					});
					fbKey.remove()
					.catch((error) => window.log(error));
				});
			}
		}
	};
};
