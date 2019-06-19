import _ from 'lodash';
import { store } from '../App';
import {
	FAVORITE_CREATE, FAVORITE_DELETE,
	LINE_ADD, LINE_REMOVE
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
