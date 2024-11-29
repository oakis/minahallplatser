import {Platform} from 'react-native';
import {
  getModel,
  getSystemVersion,
  getVersion,
  getUniqueId,
} from 'react-native-device-info';

export const isAndroid = (): boolean => Platform.OS === 'android';

export const isIOS = (): boolean => Platform.OS === 'ios';

export const getDeviceModel = (): string => getModel();

export const getOsVersion = (): string => getSystemVersion();

export const getAppVersion = (): string => getVersion();

export const deviceId = (): string => getUniqueId();
