import { combineReducers } from 'redux';
import { Reducer } from 'react-native-router-flux';
import AuthReducer from './AuthReducer';
import FavReducer from './FavReducer';
import searchReducer from './searchReducer';
import DepartureReducer from './DepartureReducer';

export const RouteReducer = params => {
    const defaultReducer = Reducer(params);
    return (state, action) => {
        console.log('ACTION:', action);
        return defaultReducer(state, action);
    };
};

export default combineReducers({
	auth: AuthReducer,
	fav: FavReducer,
	search: searchReducer,
	departures: DepartureReducer,
    routes: RouteReducer
});
