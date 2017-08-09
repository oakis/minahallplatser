import firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
	FAVORITE_CREATE,
	FAVORITE_CREATE_FAIL,
	FAVORITE_FETCH_SUCCESS,
	FAVORITE_FETCH_FAIL,
	FAVORITE_DELETE
} from './types';

export const favoriteCreate = ({ busStop, id }) => {
	const { currentUser } = firebase.auth();
	return (dispatch) => {
		firebase.database().ref(`/users/${currentUser.uid}/favorites`)
			.push({ busStop, id })
			.then(() => {
				dispatch({ type: FAVORITE_CREATE });
				Actions.dashboard({ type: 'reset' });
			}, (error) => {
				console.log('favoriteCreate error: ', error);
				favoriteCreateFail(dispatch);
			});
	};
};

const favoriteCreateFail = (dispatch) => {
	dispatch({
		type: FAVORITE_CREATE_FAIL,
		payload: { addError: 'Kunde inte spara favorit, försök igen senare. :)' }
	});
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
							console.log('favoriteGet error: ', error);
							dispatch({
								type: FAVORITE_FETCH_FAIL,
								payload: { error: 'Kunde inte ladda dina favoriter.', loading: false }
							});
						});
				} else {
					console.log('Did not find favorites locally');
					firebase.database().ref(`/users/${currentUser.uid}/favorites`)
						.on('value', snapshot => {
							AsyncStorage.setItem('minahallplatser-favorites', JSON.stringify(snapshot.val()));
							dispatch({ type: FAVORITE_FETCH_SUCCESS, payload: snapshot.val() });
						}, (error) => {
							console.log('favoriteGet error: ', error);
							dispatch({
								type: FAVORITE_FETCH_FAIL,
								payload: { error: 'Kunde inte ladda dina favoriter.', loading: false }
							});
						});
				}
			}).catch((err) => {
				console.log(err);
			});
		};
	}
	return (dispatch) => {
		dispatch({
			type: FAVORITE_FETCH_FAIL,
			payload: { error: 'Kunde inte ladda dina favoriter.', loading: false }
		});
	};
};

export const favoriteDelete = (stopId) => {
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
			console.log('Removed entry');
			dispatch({ type: FAVORITE_DELETE, payload: stopId });
		})
		.catch((error) => console.log(error));
	};
};
