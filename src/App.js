// import libraries
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'react-native-firebase';
import ReduxThunk from 'redux-thunk';
import fbPerformanceNow from 'fbjs/lib/performanceNow';
import reducers from './reducers';
import Router from './Router';

export const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

const PerformanceNow = () => global.nativePerformanceNow || global.performanceNow || fbPerformanceNow();
const startTimes = {};

if (__DEV__) {
  window.log = console.log.bind(window.console);
  window.timeStart = (label => {
      startTimes[label] = PerformanceNow();
  });
  window.timeEnd = (label => {
      const endTime = PerformanceNow();
      if (startTimes[label]) {
          const delta = endTime - startTimes[label];
          window.log(`${label}: ${delta.toFixed(3)}ms`);
          delete startTimes[label];
          return delta;
      }
      console.warn(`Warning: No such label '${label}' for window.timeEnd()`);
  });
} else {
  window.log = () => {};
  window.timeStart = () => {};
  window.timeEnd = () => {};
}

/* eslint-disable no-underscore-dangle */
const defaultHandler = (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;

ErrorUtils.setGlobalHandler(({ stack }) => {
    const { uid, email, displayName } = firebase.auth().currentUser;
    firebase.crashlytics().setStringValue('Name', displayName);
    firebase.crashlytics().setStringValue('Email', email);
    firebase.crashlytics().setUserIdentifier(uid);
    window.log('Sending error to Crashlytics:', stack);
    firebase.crashlytics().log(stack);
    defaultHandler.apply(this, arguments);
});

console.ignoredYellowBox = ['Setting a timer'];

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
