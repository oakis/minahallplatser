import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { TouchableWithoutFeedback } from 'react-native';
import RouterComponent, { BackButton, HelpButton, onBackAndroid } from './Router';
import { globals, getStorage } from './components/helpers';

const mockStore = configureMockStore([thunk]);

global.window.log = () => {};

describe('onAuthStateChanged', () => {
    it('autoLogin should be called if firebase user is logged in', async () => {
        getStorage.mockImplementation(() => Promise.resolve({ uid: 123 }));
        globals.isLoggingIn = true;
        globals.didLogout = false;
        const autoLogin = stub();
        await shallow(<RouterComponent store={mockStore()} autoLogin={autoLogin} />).dive();
        expect(autoLogin.callCount).toBe(1);
    });
    it('loginAnonUser should be called if no firebase user is logged in', async () => {
        getStorage.mockImplementation(() => Promise.resolve({ uid: 123 }));
        firebase.auth = jest.fn().mockImplementation(() => ({
            onAuthStateChanged: (fn) => {
                fn(null);
            }
        }));
        globals.isLoggingIn = true;
        globals.didLogout = false;
        const loginAnonUser = stub();
        await shallow(<RouterComponent store={mockStore()} loginAnonUser={loginAnonUser} />).dive();
        expect(loginAnonUser.callCount).toBe(1);
    });
    it('Actions.login should be called if user logged out', async () => {
        getStorage.mockImplementation(() => Promise.resolve({ uid: 456 }));
        globals.isLoggingIn = false;
        globals.didLogout = true;
        await shallow(<RouterComponent store={mockStore()} />).dive();
        expect(Actions.login.callCount).toBe(1);
    });
});

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
