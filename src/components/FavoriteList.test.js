import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import firebase from 'react-native-firebase';
import { stub } from 'sinon';
import FavoriteList from './FavoriteList';
import { getStorage } from './helpers';

const mockStore = configureMockStore([thunk]);
const initialState = {
    settings: {
        favoriteOrder: 'nothing',
        allowedGPS: false,
        hasUsedGPS: false,
    },
    fav: {
        favorites: {
            favorites: [],
            lines: [],
        }
    },
    errors: {
        error: ''
    },
    search: {
        busStop: '',
        stops: [],
        gpsLoading: false,
    }
};

it('favoriteGet should be called if local and firebase uid match', async () => {
    firebase.auth = jest.fn().mockImplementationOnce(() => ({
        currentUser: { uid: 123 }
    }));
    getStorage.mockImplementationOnce(() => Promise.resolve({ uid: 123 }));
    const favoriteGet = stub();
    await shallow(<FavoriteList store={mockStore(initialState)} favoriteGet={favoriteGet} />).dive();
    expect(favoriteGet.callCount).toBe(1);
});
