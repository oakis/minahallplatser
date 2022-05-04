// import firebase from 'react-native-firebase';

const convertSpaces = str => str.replace(/ /g, '_');

export const track = (title, props) => {
  if (props) {
    window.log(`Firebase analytics track with props: ${title}`, props);
    // firebase.analytics().logEvent(convertSpaces(title), props);
  } else {
    window.log(`Firebase analytics track: ${title}`);
    // firebase.analytics().logEvent(convertSpaces(title), {});
  }
};
