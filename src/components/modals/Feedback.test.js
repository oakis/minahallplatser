import React from 'react';
import { shallow } from 'enzyme';
import firebase from 'react-native-firebase';
import { Feedback } from './Feedback';

it('should match snapshot', () => {
    const wrapper = shallow(<Feedback />);
    expect(wrapper).toMatchSnapshot();
});

it('reset() should reset to initial state', () => {
    firebase.auth = () => ({ currentUser: { email: 'abc@123.com' } });
    const wrapper = shallow(<Feedback />);
    const initialState = wrapper.state();
    wrapper.setState({
        loading: true,
        name: 'abc',
        email: 'qwerty@asd.com',
        message: 'asdasd',
        validated: false
    });
    wrapper.instance().reset();
    expect(wrapper.state()).toEqual(initialState);
});
