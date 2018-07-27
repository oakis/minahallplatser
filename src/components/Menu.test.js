import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
import { stub } from 'sinon';
import { globals, track } from './helpers';
import { store } from '../App';
import Menu from './Menu';


const mockStore = configureMockStore([thunk]);

const initialState = {
    settings: {
        timeFormat: 'minutes',
        favoriteOrder: 'nothing',
        allowedGPS: true,
    }
};

const oldAuth = firebase.auth();

const setSetting = stub();
beforeEach(() => {
    setSetting.reset();
});

it('should match snapshot', () => {
    const wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot if anonymous', () => {
    firebase.auth = () => ({ currentUser: { isAnonymous: true } });
    const wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
    expect(wrapper).toMatchSnapshot();
});

describe('logout', () => {
    let wrapper;
    store.dispatch = jest.fn();    
    beforeEach(async () => {
        firebase.auth = () => oldAuth;
        firebase.auth().signOut.reset();
        firebase.auth().signOut.resolves({});
        AsyncStorage.clear.mockClear();
        wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
        await wrapper.instance().logout();
    });
    it('should set globals correctly', () => {
        expect(globals.didLogout).toBe(true);
        expect(globals.isLoggingIn).toBe(false);
    });

    it('should sign out from firebase', () => {
        expect(firebase.auth().signOut.callCount).toBe(1);
    });

    it('should clear AsyncStorage', () => {
        expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
    });

    it('should be tracked on success', () => {
        expect(track).toBeCalledWith('Logout', { Success: true });
    });

    it('should reset store', () => {
        expect(store.dispatch).toBeCalledWith({ type: 'RESET_ALL' });
    });
});

it('openFeedback should set feedbackVisible to true', () => {
    const wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
    wrapper.instance().openFeedback();
    expect(wrapper.state().feedbackVisible).toBe(true);
});

it('closeFeedback should set feedbackVisible to false', () => {
    const wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
    wrapper.setState({ feedbackVisible: true });
    wrapper.instance().closeFeedback();
    expect(wrapper.state().feedbackVisible).toBe(false);
});
