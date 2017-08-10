import { Platform } from 'react-native';

export const isAndroid = () => {
    return Platform.OS === 'android';
};

export const isIOS = () => {
    return Platform.OS === 'ios';
};
