import {
	FAVORITE_CREATE, FAVORITE_DELETE, FAVORITE_OPENED,
	LINE_ADD, LINE_REMOVE,
} from '../actions/types';

const INIT_STATE = {
	favorites: [],
	lines: [],
	loading: true
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case FAVORITE_CREATE:
			return { ...state, favorites: [...state.favorites, action.payload] };
		case FAVORITE_DELETE:
			return { ...state, favorites: state.favorites.filter(fav => fav.id !== action.payload) };
		case FAVORITE_OPENED:
			return {
				...state,
				favorites: state.favorites.map((fav, i) => {
					const currentOpened = state.favorites[i].opened;
					return {
						...fav,
						opened: (action.payload === fav.id) ? (currentOpened || 0) + 1 : currentOpened || 0,
					};
				})
			};
		case LINE_ADD:
			return { ...state, lines: [...state.lines, action.payload] };
		case LINE_REMOVE:
			return { ...state, lines: state.lines.filter(line => line !== action.payload) };
		default:
			return state;
	}
};
