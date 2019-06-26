import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [ReduxThunk];

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['departures']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    const store = createStore(
        persistedReducer,
        {},
        applyMiddleware(...middleware)
    );
    const persistor = persistStore(store);
    return { store, persistor };
};
