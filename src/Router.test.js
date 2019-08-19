import React from 'react';
import { shallow } from 'enzyme';
import { stub } from 'sinon';
import { TouchableWithoutFeedback } from 'react-native';
import { HelpButton } from './Router';

global.window.log = () => {};

it('HelpButton click should return callback', async () => {
    const openPopup = stub();
    const wrapper = await shallow(<HelpButton openPopup={openPopup} />);
    await wrapper.find(TouchableWithoutFeedback).props().onPress();
    expect(openPopup.callCount).toBe(1);
});
