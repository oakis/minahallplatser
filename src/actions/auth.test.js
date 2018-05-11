import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { resetUserPassword, getFirebaseError, registerUser } from './auth';
import { track } from '../components/helpers';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// const initialState = {
//     fav: {
//         favorites: [
//             { id: '9021014007900000', busStop: 'Överåsvallen, Göteborg' },
//             { id: '9021014016323000', busStop: 'Älmhult, Ale' },
//         ],
//         lines: [
//             '16 Högsbo',
//             '60 Redbergsplatsen',
//         ]
//     }
// };

describe('resetUserPassword', () => {
    beforeEach(() => {
        firebase.auth().sendPasswordResetEmail = stub().resolves();
    });

    afterEach(() => {
        firebase.auth().sendPasswordResetEmail.reset();
    });

    it('should dispatch RESET_PASSWORD on success', () => {
        const expectedActions = [
            { type: 'RESET_PASSWORD' }
        ];
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
        const store = mockStore({});
        firebase.auth().sendPasswordResetEmail = stub().rejects({ code: 'auth/network-request-failed' });
        return store.dispatch(resetUserPassword('abc@123.com')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should send user back to login', () => {
        Actions.login.reset();
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

describe('registerUser', () => {
    describe('if block', () => {
        it('should dispatch REGISTER_USER_FAIL and ERROR if passwords does not match', () => {
            const expectedActions = [
                { type: 'REGISTER_USER' },
                { type: 'REGISTER_USER_FAIL' },
                { type: 'ERROR', payload: 'Lösenorden matchade inte.' },
            ];
            const store = mockStore({});
            store.dispatch(registerUser({ email: '', password: '123', passwordSecond: '546' }));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('else if block', () => {
        const store = mockStore();        
        
        beforeAll(() => {
            firebase.auth().currentUser.isAnonymous = true;            
            firebase.auth.EmailAuthProvider = { credential: () => ({ providerId: 123, signInMethod: 'password' }) };            
        });

        afterEach(() => {
            firebase.auth().signInAndRetrieveDataWithEmailAndPassword.reset();
        });

        it('Register should be tracked with type', () => {
            return store.dispatch(registerUser({ email: 'abc@123.com', password: '123', passwordSecond: '123' })).then(() => {
                expect(track).toBeCalledWith('Register', { type: 'From Anonymous' });
            });
        });

        it('user should be signed in', () => {
            return store.dispatch(registerUser({ email: 'abc@123.com', password: '123', passwordSecond: '123' })).then(() => {
                expect(firebase.auth().signInAndRetrieveDataWithEmailAndPassword.callCount).toBe(1);
            });
        });
    });

    describe('else block', () => {
        beforeAll(() => {
            firebase.auth = () => ({
                createUserWithEmailAndPassword: stub().resolves(),
            });
        });
    
        it('should dispatch REGISTER_USER', () => {
            const expectedActions = [
                { type: 'REGISTER_USER' },
            ];
            const store = mockStore({});
            store.dispatch(registerUser({ email: '', password: '', passwordSecond: '' }));
            expect(store.getActions()).toEqual(expectedActions);
        });    
    });
});
