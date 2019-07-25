import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Router from './Router';
import SplashScreen from './components/SplashScreen';
import factory from './setupStore';
import { track } from './components/helpers';

export const { store, persistor } = factory();

class App extends Component {

  componentDidMount() {
    track('App Start');
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    );
  }

}

export default App;
