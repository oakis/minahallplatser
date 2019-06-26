import React from 'react';
import { Animated } from 'react-native';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Popup } from './Popup';

Animated.Value = () => (0);

it('should match snapshot', () => {
    const wrapper = shallow(<Popup />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<Popup />);
    wrapper.setProps({ isVisible: true });
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<Popup />);
    wrapper.setState({ isVisible: true });
    wrapper.setProps({ isVisible: false });
    expect(toJson(wrapper)).toMatchSnapshot();
});
