import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
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
        favorites: [
            { id: '9021014007900000', busStop: 'Överåsvallen, Göteborg' },
            { id: '9021014016323000', busStop: 'Älmhult, Ale' },
        ],
        lines: [],
    },
    errors: {
        error: 'Felmeddelande'
    },
    search: {
        busStop: '',
        stops: [
            { id: '9021014007483000', busStop: 'Volvo Torslanda PV, Göteborg' },
            { id: '9021014007900000', busStop: 'Överåsvallen, Göteborg' },
        ],
        gpsLoading: false,
        departureList: [
            { id: '9021014007483000', busStop: 'Volvo Torslanda PV, Göteborg' },
            { id: '9021014007900000', busStop: 'Överåsvallen, Göteborg' },
        ],
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

it('should match snapshot', async () => {
    const wrapper = await shallow(<FavoriteList store={mockStore(initialState)} />).dive();
    expect(wrapper).toMatchSnapshot();
});

describe('onInputChange', () => {
    it('should abort ongoing searches', async () => {
        fetch.abort = stub();
        const wrapper = await shallow(<FavoriteList store={mockStore(initialState)} searchChanged={jest.fn()} searchStops={jest.fn()} />).dive();
        wrapper.instance().onInputChange('a');
        expect(fetch.abort.callCount).toBe(1);
    });
    it('should reset search timeout', async () => {
        const wrapper = await shallow(<FavoriteList store={mockStore(initialState)} searchChanged={jest.fn()} searchStops={jest.fn()} />).dive();
        wrapper.instance().clearTimeout = stub();
        wrapper.instance().searchTimeout = stub();
        wrapper.instance().onInputChange('a');
        expect(wrapper.instance().clearTimeout).toBe(undefined);
    });

    it('should call searchChanged', async () => {
        const searchChanged = stub();
        const wrapper = await shallow(<FavoriteList store={mockStore(initialState)} searchChanged={searchChanged} searchStops={jest.fn()} />).dive();
        wrapper.instance().onInputChange('a');
        expect(searchChanged.callCount).toBe(1);
    });

    it('should call searchStops after some time', async () => {
        jest.useFakeTimers();
        const searchStops = stub();
        const wrapper = await shallow(<FavoriteList store={mockStore(initialState)} searchChanged={jest.fn()} searchStops={searchStops} />).dive();
        wrapper.instance().onInputChange('a');
        const timer = wrapper.instance().searchTimeout;
        expect(timer).toBeDefined();
        jest.runAllTimers();
        expect(searchStops.callCount).toBe(1);
    });
});
