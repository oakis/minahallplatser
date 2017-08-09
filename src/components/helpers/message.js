import { isAndroid, isIOS } from './device';
import { ToastAndroid } from 'react-native';

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
