import firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
	FAVORITE_CREATE,
	FAVORITE_CREATE_FAIL,
	FAVORITE_FETCH_SUCCESS,
	FAVORITE_FETCH_FAIL,
	FAVORITE_DELETE,
	ERROR
} from './types';

export const favoriteCreate = ({ busStop, id }) => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		const fbRef = firebase.database().ref(`/users/${currentUser.uid}/favorites`);
		fbRef.orderByChild('id').equalTo(id).once('value', (snapshot) => {
			if (snapshot.val() == null) {
				fbRef.push({ busStop, id })
					.then(() => {
						dispatch({ type: FAVORITE_CREATE });
						Actions.dashboard({ type: 'reset' });
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
			AsyncStorage.getItem('minahallplatser-favorites').then((dataJson) => {
				const favorites = JSON.parse(dataJson);
				if (favorites) {
					dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: favorites });
					firebase.database().ref(`/users/${currentUser.uid}/favorites`)
						.on('value', snapshot => {
							AsyncStorage.setItem('minahallplatser-favorites', JSON.stringify(snapshot.val()));
							dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: snapshot.val() });
						}, (error) => {
							window.log('favoriteGet error: ', error);
							dispatch({
								type: FAVORITE_FETCH_FAIL,
								payload: { loading: false }
							});
							dispatch({ type: ERROR, payload: 'Kunde inte ladda dina favoriter.' });
						});
				} else {
					window.log('Did not find favorites locally');
					firebase.database().ref(`/users/${currentUser.uid}/favorites`)
						.on('value', snapshot => {
							AsyncStorage.setItem('minahallplatser-favorites', JSON.stringify(snapshot.val()));
							dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: snapshot.val() });
						}, (error) => {
							window.log('favoriteGet error: ', error);
							dispatch({
								type: FAVORITE_FETCH_FAIL,
								payload: { loading: false }
							});
							dispatch({ type: ERROR, payload: 'Kunde inte ladda dina favoriter.' });
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
		let removeByKey;
		ref.on('value', snapshot => {
			snapshot.forEach((child) => {
				const id = child.val().id;
				if (id === stopId) {
					removeByKey = ref.child(child.key);
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
