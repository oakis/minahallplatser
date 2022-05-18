/* eslint-disable @typescript-eslint/no-empty-function */
import {LogBox} from 'react-native';

interface CustomWindow extends Window {
  timeStart: (value: string) => void;
  timeEnd: (value: string) => void;
  log: (...messages: string[]) => void;
}
declare let window: CustomWindow;

interface CustomGlobal extends Global {
  performance: Record<string, () => number>;
}
declare let global: CustomGlobal;

const startTimes: Record<string, number> = {};

if (__DEV__) {
  window.log = console.log.bind(console);
  window.timeStart = (label: string): void => {
    startTimes[label] = global.performance.now();
  };
  window.timeEnd = (label: string): void => {
    const endTime = global.performance.now();
    if (startTimes[label]) {
      const delta = endTime - startTimes[label];
      window.log(`${label}: ${delta.toFixed(3)}ms`);
      delete startTimes[label];
      return;
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
