// import libraries
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Crashlytics } from 'react-native-fabric';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

export const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

const PerformanceNow = global.nativePerformanceNow || global.performanceNow;
const startTimes = {};

if (__DEV__) {
  window.log = console.log.bind(window.console);
  window.timeStart = console.time || (label => {
      startTimes[label] = PerformanceNow();
  });
  window.timeEnd = console.timeEnd || (label => {
      const endTime = PerformanceNow();
      if (startTimes[label]) {
          const delta = endTime - startTimes[label];
          window.log(`${label}: ${delta.toFixed(3)}ms`);
          delete startTimes[label];
      } else {
          console.warn(`Warning: No such label '${label}' for window.timeEnd()`);
      }
  });
} else {
  window.log = () => {};
  window.timeStart = () => {};
  window.timeEnd = () => {};
}

/*eslint no-underscore-dangle: ["error", { "allow": ["_globalHandler"] }]*/
const defaultHandler = (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;

ErrorUtils.setGlobalHandler(({ stack }) => {
    const { uid, email, displayName } = store.getState().auth.user;
    Crashlytics.setUserName(displayName);
    Crashlytics.setUserEmail(email);
    Crashlytics.setUserIdentifier(uid);
    window.log('Sending error to Crashlytics:', stack);
    Crashlytics.logException(stack);
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
