import Mixpanel from 'react-native-mixpanel';
import { Answers } from 'react-native-fabric';
import { mixpanelKey } from '../../Variables';

Mixpanel.sharedInstanceWithToken(mixpanelKey);

export const track = (title, props) => {
    if (props) {
        window.log(`Mixpanel track with props: ${title}`, props);
        Mixpanel.trackWithProperties(title, props);
        Answers.logCustom(title, props);
    } else {
        window.log(`Mixpanel track: ${title}`);
        Mixpanel.track(title);
        Answers.logCustom(title);
    }
};
