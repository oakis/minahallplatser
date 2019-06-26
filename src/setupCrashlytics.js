import firebase from 'react-native-firebase';

const defaultHandler = global.ErrorUtils.getGlobalHandler();
const crashlytics = firebase.crashlytics();

global.ErrorUtils.setGlobalHandler((...args) => {
  const error = args[0] || 'Unknown';
  console.log('Crashlytics error sent', error);

  if (error instanceof Error) {
    crashlytics.setStringValue('stack', `${error.stack}`);
    crashlytics.recordError(0, `RN Fatal: ${error.message}`);
  } else {
    // Have never gotten this log so far. Might not be necessary.
    crashlytics.recordError(0, `RN Fatal: ${error}`);
  }

  defaultHandler.apply(this, args);
});
