import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Router from '@src/Router';
import SplashScreen from './components/SplashScreen';
import factory from '@src/setupStore';
import {track} from '@helpers';
import {colors} from '@style';

export const {store, persistor} = factory();

const App = (): JSX.Element => {
  useEffect(() => {
    track('App Start');
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <Router />
      </PersistGate>
    </Provider>
  );
};

export default App;
