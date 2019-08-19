import _ from 'lodash';
import { store } from '../App';
import {
	FAVORITE_CREATE, FAVORITE_DELETE, FAVORITE_OPENED,
	LINE_ADD, LINE_REMOVE,
	LINE_LOCAL_ADD, LINE_LOCAL_REMOVE,
} from './types';
import { track, } from '../components/helpers';

// Stops

export const favoriteCreate = (payload) => {
	window.log('favoriteCreate():', payload.id);
	return (dispatch) => {
		dispatch({ type: FAVORITE_CREATE, payload });
	};
};

export const favoriteDelete = (stopId) => {
	window.log('favoriteDelete():', stopId);
	return (dispatch) => {
		dispatch({ type: FAVORITE_DELETE, payload: stopId });
	};
};

export const incrementStopsOpened = (stopId) => {
	window.log('incrementStopsOpened()', stopId);
	return (dispatch) => {
		dispatch({ type: FAVORITE_OPENED, payload: stopId });
	};
};

// Lines

export const favoriteLineToggle = ({ sname, direction }) => {
	const line = `${sname} ${direction}`;
	return (dispatch) => {
		if (_.includes(store.getState().fav.lines, line)) {
			track('Favorite Line Remove', { Line: line });
			dispatch({ type: LINE_REMOVE, payload: line });
		} else {
			track('Favorite Line Add', { Line: line });
			dispatch({ type: LINE_ADD, payload: line });
		}
	};
};

export const favoriteLineLocalAdd = ({ sname, direction }, stop) => {
	const line = `${sname} ${direction}`;
	return (dispatch) => {
		track('Favorite Line Local Add', { Line: line, Stop: stop });
		dispatch({ type: LINE_LOCAL_ADD, payload: { line, stop } });
	};
};

export const favoriteLineLocalRemove = ({ sname, direction }, stop) => {
	const line = `${sname} ${direction}`;
	return (dispatch) => {
		track('Favorite Line Local Remove', { Line: line, Stop: stop });
		dispatch({ type: LINE_LOCAL_REMOVE, payload: { line, stop } });
	};
};
