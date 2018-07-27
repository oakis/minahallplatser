import React from 'react';
import { Animated } from 'react-native';
import { shallow } from 'enzyme';
import { Popup } from './Popup';

Animated.Value = () => (0);

it('should match snapshot', () => {
    const wrapper = shallow(<Popup />);
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<Popup />);
    wrapper.setProps({ isVisible: true });
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<Popup />);
    wrapper.setState({ isVisible: true });  
    wrapper.setProps({ isVisible: false });
    expect(wrapper).toMatchSnapshot();
});
