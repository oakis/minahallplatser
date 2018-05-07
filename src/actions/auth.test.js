import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { resetUserPassword, getFirebaseError } from './auth';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('resetUserPassword', () => {
    it('should dispatch RESET_PASSWORD on success', () => {
        const expectedActions = [
            { type: 'RESET_PASSWORD' }
        ];
        firebase.auth = () => ({
            sendPasswordResetEmail: stub().resolves(),
        });
        const store = mockStore({});
        return store.dispatch(resetUserPassword('abc@123.com')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch RESET_PASSWORD & ERROR on fail', () => {
        const expectedActions = [
            { type: 'RESET_PASSWORD' },
            { type: 'ERROR', payload: getFirebaseError({ code: 'auth/network-request-failed' }) },
        ];
        firebase.auth = () => ({
            sendPasswordResetEmail: stub().rejects({ code: 'auth/network-request-failed' }),
        });
        const store = mockStore({});
        return store.dispatch(resetUserPassword('abc@123.com')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should send user back to login', () => {
        Actions.login.reset();
        firebase.auth = () => ({
            sendPasswordResetEmail: stub().resolves(),
        });
        const store = mockStore({});
        return store.dispatch(resetUserPassword('abc@123.com')).then(() => {
            expect(Actions.login.callCount).toBe(1);
        });
    });

    it('should dispatch ERROR if input is empty', () => {
        const expectedActions = [
            { type: 'ERROR', payload: getFirebaseError({ code: 'auth/invalid-email' }) },
        ];
        const store = mockStore({});
        store.dispatch(resetUserPassword(''));
        expect(store.getActions()).toEqual(expectedActions);
    });
});

