import crashlytics from '@react-native-firebase/crashlytics';

const defaultHandler = global.ErrorUtils.getGlobalHandler();

global.ErrorUtils.setGlobalHandler((...args) => {
  const error = args[0] || 'Unknown';
  console.log('Crashlytics error sent', error);

  if (error instanceof Error) {
    crashlytics().setAttribute('stack', `${error.stack}`);
    crashlytics().recordError(error);
  } else {
    // Have never gotten this log so far. Might not be necessary.
    crashlytics().recordError(error);
  }

  defaultHandler.apply(this, args);
});
