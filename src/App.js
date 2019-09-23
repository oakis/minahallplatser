import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Router from './Router';
import SplashScreen from './components/SplashScreen';
import factory from './setupStore';
import { track } from './components/helpers';
import { colors } from './components/style';

export const { store, persistor } = factory();

class App extends Component {

  componentDidMount() {
    track('App Start');
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
          />
          <Router />
        </PersistGate>
      </Provider>
    );
  }

}

export default App;
