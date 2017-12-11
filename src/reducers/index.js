import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import FavReducer from './FavReducer';
import searchReducer from './searchReducer';
import DepartureReducer from './DepartureReducer';
import ErrorReducer from './ErrorReducer';
import SettingsReducer from './SettingsReducer';

export default combineReducers({
	auth: AuthReducer,
	fav: FavReducer,
	search: searchReducer,
	departures: DepartureReducer,
	errors: ErrorReducer,
	settings: SettingsReducer
});
