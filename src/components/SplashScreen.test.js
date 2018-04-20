import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import firebase from 'firebase';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import SplashScreen from './SplashScreen';

jest.mock('./helpers', () => ({
    getStorage: () => Promise.resolve({ uid: 123 }),
    globals: {},
    track: jest.fn()
}));

jest.mock('../actions', () => ({
    auth: {
        autoLogin: stub()
    }
}));

const mockStore = configureMockStore([thunk]);

firebase.auth().onAuthStateChanged = (fn) => {
    fn({ uid: 123 });
};

global.window.log = () => {};

describe('SplashScreen', () => {
    it('should match snapshot', async () => {
        const wrapper = await shallow(<SplashScreen store={mockStore()} />);
        expect(wrapper.dive()).toMatchSnapshot();
    });
    describe('autoLogin', () => {
        it('should be called once', async () => {
            const autoLogin = stub();
            const wrapper = shallow(<SplashScreen store={mockStore()} autoLogin={autoLogin} />);
            await wrapper.dive();
            expect(autoLogin.callCount).toBe(1);
        });
    });
});
