import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import { Actions } from 'react-native-router-flux';
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

window.log = () => {};

it('favoriteGet should be called if local and firebase uid match', async () => {
    getStorage.mockImplementationOnce(() => Promise.resolve({ uid: 123 }));
    const favoriteGet = stub();
    await shallow(<FavoriteList store={mockStore(initialState)} favoriteGet={favoriteGet} />).dive();
    expect(favoriteGet.callCount).toBe(1);
});

it('getNearbyStops should be called if logged in and user has accepted GPS', async () => {
    getStorage
        .mockImplementationOnce(() => Promise.resolve(null))
        .mockImplementationOnce(() => Promise.resolve({}));
    const getNearbyStops = stub();
    initialState.settings.hasUsedGPS = true;
    initialState.settings.allowedGPS = true;
    await shallow(<FavoriteList store={mockStore(initialState)} getNearbyStops={getNearbyStops} />).dive();
    expect(getNearbyStops.callCount).toBe(1);
});

it('HelpButton to the right side of the navbar, and state.init to be false', async () => {
    getStorage.mockImplementation(() => Promise.resolve());
    const refresh = Actions.refresh = stub();
    const wrapper = await shallow(<FavoriteList store={mockStore(initialState)} />).dive();
    wrapper.setProps();
    expect(refresh.callCount).toBe(1);
    expect(wrapper.state().init).toBe(false);
});
