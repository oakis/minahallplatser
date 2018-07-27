import React from 'react';
import { shallow } from 'enzyme';
import firebase from 'react-native-firebase';
import Profile from './Profile';

it('should match snapshot if e-mail account', () => {
    const wrapper = shallow(<Profile />);
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot if facebook account', () => {
    firebase.auth().currentUser.providerData.push({ displayName: 'John Doe' });
    const wrapper = shallow(<Profile />);
    expect(wrapper).toMatchSnapshot();
});
