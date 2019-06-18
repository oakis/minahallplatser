import React from 'react';
import { shallow } from 'enzyme';
import { isAndroid } from '../helpers';
import { Button } from './';

it('should match snapshot on Android', () => {
    isAndroid.mockImplementationOnce(() => true);
    const wrapper = shallow(<Button />);
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot on iOS', () => {
    isAndroid.mockImplementationOnce(() => false);
    const wrapper = shallow(<Button />);
    expect(wrapper).toMatchSnapshot();
});

it('should fire callback function onPress on Android', () => {
    isAndroid.mockImplementationOnce(() => true);
    const onPress = jest.fn();
    const wrapper = shallow(<Button label="Stäng" onPress={onPress} />);
    wrapper.simulate('press');
    expect(onPress).toHaveBeenCalledTimes(1);
});

it('should fire callback function onPress on iOS', () => {
    isAndroid.mockImplementationOnce(() => false);
    const onPress = jest.fn();
    const wrapper = shallow(<Button label="Stäng" onPress={onPress} />);
    wrapper.simulate('press');
    expect(onPress).toHaveBeenCalledTimes(1);
});
