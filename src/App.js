// import libraries
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

if (__DEV__) {
  window.log = console.log.bind(window.console);
} else {
  window.log = () => {};
}

console.ignoredYellowBox = ['Setting a timer'];

if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: 'AIzaSyDIOpswAOjBWwBMsViR6L0tNmliBrmMxTM',
      authDomain: 'minahallplatser.firebaseapp.com',
      databaseURL: 'https://minahallplatser.firebaseio.com',
      storageBucket: 'minahallplatser.appspot.com',
      messagingSenderId: '814413367686'
    });
}

export const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }

}

export default App;
