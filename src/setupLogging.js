import {LogBox} from 'react-native';

const PerformanceNow = () =>
  global.nativePerformanceNow || global.performanceNow;
const startTimes = {};

if (__DEV__) {
  window.log = console.log.bind(window.console);
  window.timeStart = label => {
    startTimes[label] = PerformanceNow();
  };
  window.timeEnd = label => {
    const endTime = PerformanceNow();
    if (startTimes[label]) {
      const delta = endTime - startTimes[label];
      window.log(`${label}: ${delta.toFixed(3)}ms`);
      delete startTimes[label];
      return delta;
    }
    console.warn(`Warning: No such label '${label}' for window.timeEnd()`);
  };
} else {
  window.log = () => {};
  window.timeStart = () => {};
  window.timeEnd = () => {};
}

LogBox.ignoreLogs([
  'Setting a timer',
  'Require cycle',
  'VirtualizedLists should never be nested',
  'window.timeEnd()',
]);
