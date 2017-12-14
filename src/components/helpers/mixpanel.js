import Mixpanel from 'react-native-mixpanel';
import { mixpanelKey } from '../../Variables';
Mixpanel.sharedInstanceWithToken(mixpanelKey);

export const track = (title, props) => {
    if (props) {
        window.log('Mixpanel track with props: ' + title, props);
        Mixpanel.trackWithProperties(title, props);
    } else {
        window.log('Mixpanel track: ' + title);
        Mixpanel.track(title);
    }
}
