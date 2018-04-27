import React from 'react';
import { AppState, Keyboard } from 'react-native';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
import FavoriteList from './FavoriteList';
import { getStorage, track } from './helpers';
import { CLR_ERROR, CLR_SEARCH } from '../actions/types';
import { store } from '../App';

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

it('HelpButton to the right side of the navbar, and state.init to be false', () => {
    getStorage.mockImplementation(() => Promise.resolve());
    const refresh = Actions.refresh = stub();
    const wrapper = shallow(<FavoriteList store={mockStore(initialState)} />).dive();
    wrapper.setProps();
    expect(refresh.callCount).toBe(1);
    expect(wrapper.state().init).toBe(false);
});

it('should match snapshot', () => {
    const wrapper = shallow(<FavoriteList store={mockStore(initialState)} />).dive();
    expect(wrapper).toMatchSnapshot();
});

describe('onInputChange', () => {
    let wrapper;
    const searchChanged = stub();
    const searchStops = stub();
    
    beforeEach(() => {
        wrapper = shallow(<FavoriteList store={mockStore(initialState)} searchChanged={searchChanged} searchStops={searchStops} />).dive();
        searchChanged.reset();
    });
    it('should abort ongoing searches', () => {
        fetch.abort = stub();
        wrapper.instance().onInputChange('a');
        expect(fetch.abort.callCount).toBe(1);
    });
    it('should reset search timeout', () => {
        wrapper.instance().clearTimeout = stub();
        wrapper.instance().searchTimeout = stub();
        wrapper.instance().onInputChange('a');
        expect(wrapper.instance().clearTimeout).toBe(undefined);
    });

    it('should call searchChanged', () => {
        wrapper.instance().onInputChange('a');
        expect(searchChanged.callCount).toBe(1);
    });

    it('should call searchStops after some time', () => {
        jest.useFakeTimers();
        wrapper.instance().onInputChange('a');
        const timer = wrapper.instance().searchTimeout;
        expect(timer).toBeDefined();
        jest.runAllTimers();
        expect(searchStops.callCount).toBe(1);
    });
});

describe('componentWillUnmount', () => {
    let wrapper;
    const clearErrors = stub();
    
    beforeEach(() => {
        wrapper = shallow(<FavoriteList store={mockStore(initialState)} clearErrors={clearErrors} />).dive();
        clearErrors.reset();
    });
    it('should abort ongoing http requests', () => {
        fetch.abort = stub();
        wrapper.unmount();
        expect(fetch.abort.callCount).toBe(1);
    });

    it('should call abort with "searchStops"', () => {
        fetch.abort = jest.fn();
        wrapper.unmount();
        expect(fetch.abort).toBeCalledWith('searchStops');
    });

    it('should clear all errors', () => {
        wrapper.unmount();
        expect(clearErrors.callCount).toBe(1);
    });

    it('should remove appstate event listener', () => {
        AppState.removeEventListener = stub();
        wrapper.unmount();
        expect(AppState.removeEventListener.callCount).toBe(1);
    });
});

describe('handleAppStateChange', () => {
    let wrapper;
    const getNearbyStops = stub();    
    
    beforeEach(() => {
        wrapper = shallow(<FavoriteList store={mockStore(initialState)} getNearbyStops={getNearbyStops} />).dive();
        getNearbyStops.reset();
    });
    it('should refresh nearby stops if prev accepted by user', () => {
        initialState.settings.hasUsedGPS = true;
        initialState.settings.allowedGPS = true;
        wrapper.instance().handleAppStateChange('active');
        expect(getNearbyStops.callCount).toBe(1);
    });

    it('should track page view if user is reopening app', () => {
        track.mockReset();
        wrapper.instance().handleAppStateChange('active');
        expect(track).toBeCalledWith('Page View', { Page: 'Dashboard', Type: 'Reopened app from background' });
    });
});

it('resetSearch should dispatch CLR_SEARCH & CLR_ERROR', () => {
    store.dispatch = jest.fn();
    const wrapper = shallow(<FavoriteList store={mockStore(initialState)} />).dive();
    wrapper.instance().resetSearch();
    expect(store.dispatch).toBeCalledWith({ type: CLR_SEARCH });
    expect(store.dispatch).toBeCalledWith({ type: CLR_ERROR });
});

describe('refreshNearbyStops', () => {
    let wrapper;
    const setSetting = jest.fn();
    const getNearbyStops = stub();    
    
    beforeEach(() => {
        wrapper = shallow(<FavoriteList store={mockStore(initialState)} setSetting={setSetting} getNearbyStops={getNearbyStops} />).dive();
    });
    it('should be tracked', () => {
        track.mockReset();
        wrapper.instance().refreshNearbyStops();
        expect(track).toBeCalledWith('Refresh NearbyStops');
    });

    it('should call setSetting with "hasUsedGPS", true', () => {
        wrapper.instance().refreshNearbyStops();
        expect(setSetting).toBeCalledWith('hasUsedGPS', true);
    });

    it('should call getNearbyStops', () => {
        getNearbyStops.reset();
        wrapper.instance().refreshNearbyStops();
        expect(getNearbyStops.callCount).toBe(1);
    });
});

describe('openPopup', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<FavoriteList store={mockStore(initialState)} />).dive();
    });
    it('should be tracked', () => {
        track.mockReset();
        wrapper.instance().openPopup();
        expect(track).toBeCalledWith('Show Help', { Page: 'Dashboard' });
    });

    it('should set showHelp state to true', () => {
        expect(wrapper.state().showHelp).toBe(false);
        wrapper.instance().openPopup();
        expect(wrapper.state().showHelp).toBe(true);
    });
});

describe('renderFavoriteItem', () => {
    let wrapper;
    let ListItem;
    const clearErrors = stub();
    Keyboard.dismiss = stub();
    Actions.departures = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<FavoriteList store={mockStore(initialState)} clearErrors={clearErrors} />).dive();
        ListItem = wrapper.find('FlatList').last().props().renderItem({ item: { busStop: 'Centralstationen', id: '1' } });
        Keyboard.dismiss.reset();
        clearErrors.reset();
        Actions.departures.mockReset();
        // jest.fn().
    });

    describe('pressItem', () => {
        beforeEach(async () => {
            await ListItem.props.pressItem();
        });
        it('should dismiss keyboard', () => {
            expect(Keyboard.dismiss.callCount).toBe(1);
        });

        it('should clear all errors', () => {
            expect(clearErrors.callCount).toBe(1);
        });

        it('should change view to departures', () => {
            expect(Actions.departures).toBeCalledWith({ busStop: 'Centralstationen', id: '1', title: 'Centralstationen' });
        });
    });

    describe('pressIcon', () => {
        beforeEach(() => {
            ListItem.props.pressIcon();
        });
        it('should dismiss keyboard', () => {
            expect(Keyboard.dismiss.callCount).toBe(1);
        });
    });
});
