import { ToastAndroid } from 'react-native';
import { isAndroid, isIOS } from './device';

export const showMessage = (length, message) => {
    if (isAndroid()) {
        ToastAndroid.showWithGravity(
            message,
            (length === 'long') ? ToastAndroid.LONG : ToastAndroid.SHORT,
            ToastAndroid.CENTER
        );
    } else if (isIOS()) {
        console.log(message);
    } else {
        console.log('Message ignored since device is not Android nor iOS');
    }
};
