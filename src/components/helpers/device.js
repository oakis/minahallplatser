import {Platform} from 'react-native';
import {
  getModel,
  getSystemVersion,
  getVersion,
  getUniqueId,
} from 'react-native-device-info';

export const isAndroid = () => Platform.OS === 'android';

export const isIOS = () => Platform.OS === 'ios';

export const getDeviceModel = () => getModel();

export const getOsVersion = () => getSystemVersion();

export const getAppVersion = () => getVersion();

export const deviceId = () => getUniqueId();
