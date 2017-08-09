// import libraries
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

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

class App extends Component {

  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <Router />
      </Provider>
    );
  }

}

export default App;
