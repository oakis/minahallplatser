import React from 'react';
import { AppState } from 'react-native';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import { LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import LoginForm from './LoginForm';
import { track } from './helpers';

const mockStore = configureMockStore([thunk]);

const initialState = {
    auth: {
        email: 'abc@123.com',
        password: 'abc123',
        loading: false,
        token: '',
        loadingAnon: '',
    },
    errors: {
        error: 'Some login error'
    }
};

window.log = () => {};

it('should match snapshot', () => {
    const wrapper = shallow(<LoginForm store={mockStore(initialState)} />).dive();
    expect(wrapper).toMatchSnapshot();
});

describe('email input', () => {
    let wrapper;
    const emailChanged = jest.fn();
    beforeEach(() => {
        wrapper = shallow(<LoginForm store={mockStore(initialState)} emailChanged={emailChanged} />).dive();
        emailChanged.mockReset();
    });
    it('email value should match state', () => {
        const value = wrapper.find('Input').first().prop('value');
        expect(value).toBe('abc@123.com');
    });
    
    it('emailChanged should be called with the input value', () => {
        const input = wrapper.find('Input').first();
        input.simulate('changeText', 'def@123.com');
        expect(emailChanged).toBeCalledWith('def@123.com');
    });
});

describe('password input', () => {
    let wrapper;
    const passwordChanged = jest.fn();
    beforeEach(() => {
        wrapper = shallow(<LoginForm store={mockStore(initialState)} passwordChanged={passwordChanged} />).dive();
        passwordChanged.mockReset();
    });
    it('password value should match initial state', () => {
        const value = wrapper.find('Input').at(1).prop('value');
        expect(value).toBe('abc123');
    });
    
    it('passwordChanged should be called with the input value', () => {
        const input = wrapper.find('Input').at(1);
        input.simulate('changeText', 'abc456');
        expect(passwordChanged).toBeCalledWith('abc456');
    });
});

it('Logga in button should dispatch loginUser with correct props', () => {
    const loginUser = jest.fn();
    const wrapper = shallow(<LoginForm store={mockStore(initialState)} loginUser={loginUser} />).dive();
    const button = wrapper.find('Button').at(0);
    button.simulate('press');
    expect(loginUser).toBeCalledWith({ email: 'abc@123.com', password: 'abc123' });
});

describe('componentWillUnmount', () => {
    let wrapper;
    const resetRoute = stub();
    const clearErrors = stub();
    beforeEach(() => {
        wrapper = shallow(<LoginForm store={mockStore(initialState)} resetRoute={resetRoute} clearErrors={clearErrors} />).dive();
        resetRoute.reset();
        clearErrors.reset();
    });

    it('should call resetRoute', () => {
        wrapper.unmount();
        expect(resetRoute.callCount).toBe(1);
    });

    it('should call clearErrors', () => {
        wrapper.unmount();
        expect(clearErrors.callCount).toBe(1);
    });

    it('should remove event listeners', () => {
        AppState.removeEventListener = stub();
        wrapper.unmount();
        expect(AppState.removeEventListener.callCount).toBe(1);
    });
});

describe('loginFacebook', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<LoginForm store={mockStore(initialState)} />).dive();
        track.mockReset();
    });

    it('should track start', () => {
        wrapper.instance().loginFacebook();
        expect(track).toBeCalledWith('Login Facebook Start');
    });

    it('should track cancel', async () => {
        LoginManager.logInWithReadPermissions = () => Promise.resolve({ isCancelled: true });
        await wrapper.instance().loginFacebook();
        expect(track).toBeCalledWith('Login Facebook Cancel');
    });

});
