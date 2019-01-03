// import { Crashlytics } from 'react-native-fabric';
import firebase from 'react-native-firebase';

/* eslint-disable no-underscore-dangle */
/* const defaultHandler = (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;

ErrorUtils.setGlobalHandler(async ({ stack }) => {
    window.log('Oops, something went wrong:', stack);
    const { uid } = firebase.auth().currentUser;
    await logToFirebase(stack, uid);
    await logToFabric(stack, uid);
    defaultHandler.apply(this, arguments);
});

const logToFirebase = async (stack, uid) => {
    window.log('Sending stack to Firebase Crashlytics');
    firebase.crashlytics().setUserIdentifier(uid);
    await firebase.crashlytics().recordError(1, stack);
    window.log('Sent stack to Firebase Crashlytics');
};

const logToFabric = async (stack, uid) => {
  window.log('Sending stack to Fabric Crashlytics');
  Crashlytics.setUserIdentifier(uid);
  await Crashlytics.logException(stack);
  window.log('Sent stack to Fabric Crashlytics');
}; */

const defaultHandler = global.ErrorUtils.getGlobalHandler()
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
