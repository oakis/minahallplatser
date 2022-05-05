import analytics from '@react-native-firebase/analytics';

const convertSpaces = str => str.replace(/ /g, '_');

export const track = (title, props) => {
  if (props) {
    window.log(`Firebase analytics track with props: ${title}`, props);
    analytics().logEvent(convertSpaces(title), props);
  } else {
    window.log(`Firebase analytics track: ${title}`);
    analytics().logEvent(convertSpaces(title), {});
  }
};
