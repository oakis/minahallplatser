import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import ReduxThunk from 'redux-thunk';
import rootReducer from '@reducers';

const middleware = [ReduxThunk];

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['departures', 'search', 'errors'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    persistedReducer,
    {},
    composeEnhancers(applyMiddleware(...middleware)),
  );
  const persistor = persistStore(store);
  return {store, persistor};
};
