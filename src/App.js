// import libraries
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Crashlytics } from 'react-native-fabric';
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

ErrorUtils.setGlobalHandler(async ({ stack }) => {
    window.log('Oops, something went wrong:', stack);
    const { uid, email, displayName } = firebase.auth().currentUser;
    await logToFirebase(stack, uid, email, displayName);
    await logToFabric(stack, uid, email, displayName);
    defaultHandler.apply(this, arguments);
});

const logToFirebase = async (stack, uid = null, email = null, displayName = null) => {
    window.log('Sending stack to Firebase Crashlytics');
    firebase.crashlytics().setStringValue('Name', displayName);
    firebase.crashlytics().setStringValue('Email', email);
    firebase.crashlytics().setUserIdentifier(uid);
    await firebase.crashlytics().recordError(1, stack);
    window.log('Sent stack to Firebase Crashlytics');
};

const logToFabric = async (stack, uid = null, email = null, displayName = null) => {
  window.log('Sending stack to Fabric Crashlytics');
  Crashlytics.setUserName(displayName);
  Crashlytics.setUserEmail(email);
  Crashlytics.setUserIdentifier(uid);
  await Crashlytics.logException(stack);
  window.log('Sent stack to Fabric Crashlytics');
};

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
