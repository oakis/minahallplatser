import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import RouterComponent from './Router';
import { globals, getStorage } from './components/helpers';

jest.mock('react-native-router-flux', () => ({
    Router: jest.fn(),
    Stack: jest.fn(),
    Scene: jest.fn(),
    Drawer: jest.fn(),
    Actions: jest.fn()
}));

jest.mock('./components/helpers', () => ({
    getStorage: jest.fn(),
    globals: {},
    track: jest.fn(),
    isAndroid: jest.fn(),
}));

jest.mock('./actions', () => ({
    auth: {
        autoLogin: stub(),
        loginAnonUser: stub(),
    }
}));

const mockStore = configureMockStore([thunk]);

global.window.log = () => {};

describe('Router', () => {
    describe('autoLogin', () => {
        it('should be called once', async () => {
            getStorage.mockImplementation(() => Promise.resolve({ uid: 123 }));
            const autoLogin = stub();
            const wrapper = shallow(<RouterComponent store={mockStore()} autoLogin={autoLogin} />);
            await wrapper.dive();
            expect(autoLogin.callCount).toBe(1);
        });
    });
    describe('loginAnonUser', () => {
        it('should be called once', async () => {
            getStorage.mockImplementation(() => Promise.resolve({ uid: 456 }));
            globals.isLoggingIn = true;
            globals.didLogout = false;
            const loginAnonUser = stub();
            const wrapper = shallow(<RouterComponent store={mockStore()} loginAnonUser={loginAnonUser} />);
            await wrapper.dive();
            expect(loginAnonUser.callCount).toBe(1);
        });
    });
});
