import React from 'react';
import { shallow } from 'enzyme';
import { stub } from 'sinon';
import { TouchableWithoutFeedback } from 'react-native';
import { BackButton, HelpButton, onBackAndroid } from './Router';
import { globals } from './components/helpers';

global.window.log = () => {};


it('BackButton click should return user to previous screen', async () => {
    const wrapper = shallow(<BackButton />);
    await wrapper.find(TouchableWithoutFeedback).props().onPress();
    expect(Actions.pop.callCount).toBe(1);
});

it('HelpButton click should return callback', async () => {
    const openPopup = stub();
    const wrapper = await shallow(<HelpButton openPopup={openPopup} />);
    await wrapper.find(TouchableWithoutFeedback).props().onPress();
    expect(openPopup.callCount).toBe(1);
});

describe('onBackAndroid', () => {
    it('should return false if currentScene is login and shouldExitApp is true', () => {
        Actions.currentScene = 'login';
        globals.shouldExitApp = true;
        expect(onBackAndroid()).toBe(false);
    });
    it('should return false if currentScene is _favlist and shouldExitApp is true', () => {
        Actions.currentScene = '_favlist';
        globals.shouldExitApp = true;
        expect(onBackAndroid()).toBe(false);
    });
    it('should return true if currentScene is not login or _favlist', () => {
        Actions.currentScene = '';
        expect(onBackAndroid()).toBe(true);
    });
    it('should return true if currentScene is login and shouldExitApp is false', () => {
        Actions.currentScene = 'login';
        globals.shouldExitApp = false;
        expect(onBackAndroid()).toBe(true);
    });
    it('should return true if currentScene is _favlist and shouldExitApp is false', () => {
        Actions.currentScene = '_favlist';
        globals.shouldExitApp = false;
        expect(onBackAndroid()).toBe(true);
    });
});
