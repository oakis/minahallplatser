import React from 'react';
import { shallow } from 'enzyme';
import { stub } from 'sinon';
import { TouchableWithoutFeedback } from 'react-native';
import { BackButton, HelpButton } from './Router';

global.window.log = () => {};


// it('BackButton click should return user to previous screen', async () => {
//     const wrapper = shallow(<BackButton />);
//     await wrapper.find(TouchableWithoutFeedback).props().onPress();
//     expect(Actions.pop.callCount).toBe(1);
// });

it('HelpButton click should return callback', async () => {
    const openPopup = stub();
    const wrapper = await shallow(<HelpButton openPopup={openPopup} />);
    await wrapper.find(TouchableWithoutFeedback).props().onPress();
    expect(openPopup.callCount).toBe(1);
});
