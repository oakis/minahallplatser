jest.mock('redux-persist', () => ({
  persistReducer: () => jest.fn(),
  persistStore: () => jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcon');

jest.mock('react-native-device-info', () => {
  return {
    getUniqueId: jest.fn(),
  };
});

jest.mock('react-native-reanimated', () => ({
  decay: jest.fn(),
  timing: () => ({start: jest.fn()}),
  spring: jest.fn(),
  add: jest.fn(),
  divide: jest.fn(),
  multiply: jest.fn(),
  modulo: jest.fn(),
  diffClamp: jest.fn(),
  delay: jest.fn(),
  sequence: jest.fn(),
  parallel: jest.fn(),
  stagger: jest.fn(),
  loop: jest.fn(),
  event: jest.fn(),
  forkEvent: jest.fn(),
  unforkEvent: jest.fn(),
  Value: jest.fn(),
  View: 'Animated.View',
  ScrollView: 'Animated.ScrollView',
  EasingNode: {
    step0: jest.fn(),
    step1: jest.fn(),
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
    poly: jest.fn(),
    sin: jest.fn(),
    circle: jest.fn(),
    exp: jest.fn(),
    elastic: jest.fn(),
    back: jest.fn(),
    bounce: jest.fn(),
    bezier: jest.fn(),
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
  },
}));

jest.mock('react-native-geolocation-service', () => {});

jest.mock('@react-native-async-storage/async-storage', () => {});

jest.mock('./components/helpers', () => ({
  globals: {},
  track: jest.fn(),
  isAndroid: jest.fn(),
  showMessage: jest.fn(),
  updateStopsCount: jest.fn(),
  getDeviceModel: jest.fn(),
  getOsVersion: jest.fn(),
  getAppVersion: jest.fn(),
  getToken: jest.fn().mockImplementation(() => ({
    then: fn => {
      fn({access_token: 123});
    },
  })),
}));

jest.mock('@react-native-firebase/crashlytics', () => {
  return () => {
    return {
      setAttribute: jest.fn(),
      recordError: jest.fn(),
    };
  };
});

jest.mock('@react-native-firebase/analytics', () => {
  return () => {
    return {
      logScreenView: jest.fn(),
      logEvent: jest.fn(),
    };
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: jest.fn(),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: jest.fn(),
  };
});

window.timeStart = jest.fn();
window.timeEnd = jest.fn();
