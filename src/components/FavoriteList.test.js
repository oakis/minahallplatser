import React from 'react';
import { AppState, Keyboard } from 'react-native';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import fetch from 'react-native-cancelable-fetch';
import FavoriteList from './FavoriteList';
import { track } from './helpers';
import { CLR_ERROR, CLR_SEARCH } from '../actions/types';
import { store } from '../App';
import { navigation } from './helpers/testhelper.js';

const mockStore = configureMockStore([thunk]);
const initialState = {
    settings: {
        favoriteOrder: 'nothing',
        allowedGPS: false,
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

// REWRITE?
it('getNearbyStops should be called if logged in and user has accepted GPS', async () => {
    const getNearbyStops = stub();
    initialState.settings.allowedGPS = true;
    await shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} getNearbyStops={getNearbyStops} />).dive();
    expect(getNearbyStops.callCount).toBe(1);
});

it('HelpButton to the right side of the navbar, and state.init to be false', () => {
    const wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} getNearbyStops={jest.fn()} />).dive();
    wrapper.setProps({ getNearbyStops: jest.fn() }); // Must set something to actually run.
    expect(wrapper.state().init).toBe(false);
});

it('should match snapshot', () => {
    const wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} getNearbyStops={jest.fn()} />).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
});

describe('onInputChange', () => {
    let wrapper;
    const searchChanged = stub();
    const searchStops = stub();

    beforeEach(() => {
        wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} searchChanged={searchChanged} searchStops={searchStops} getNearbyStops={jest.fn()} />).dive();
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
        wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} clearErrors={clearErrors} getNearbyStops={jest.fn()} />).dive();
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
        wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} getNearbyStops={getNearbyStops} />).dive();
        getNearbyStops.reset();
    });
    it('should refresh nearby stops if prev accepted by user', () => {
        initialState.settings.allowedGPS = true;
        wrapper.instance().handleAppStateChange('active');
        expect(getNearbyStops.callCount).toBe(1);
    });

    it('should track page view if user is reopening app', () => {
        track.mockReset();
        wrapper.instance().handleAppStateChange('active');
        expect(track).toBeCalledWith('Page View', { Page: 'Dashboard', Parent: 'Background' });
    });
});

it('resetSearch should dispatch CLR_SEARCH & CLR_ERROR', () => {
    store.dispatch = jest.fn();
    const wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} getNearbyStops={jest.fn()} />).dive();
    wrapper.instance().resetSearch();
    expect(store.dispatch).toBeCalledWith({ type: CLR_SEARCH });
    expect(store.dispatch).toBeCalledWith({ type: CLR_ERROR });
});

describe('refreshNearbyStops', () => {
    let wrapper;
    const setSetting = jest.fn();
    const getNearbyStops = stub();

    beforeEach(() => {
        wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} setSetting={setSetting} getNearbyStops={getNearbyStops} />).dive();
    });
    it('should be tracked', () => {
        track.mockReset();
        wrapper.instance().refreshNearbyStops();
        expect(track).toBeCalledWith('Refresh NearbyStops');
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
        wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} getNearbyStops={jest.fn()} />).dive();
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

    beforeEach(() => {
        wrapper = shallow(<FavoriteList navigation={navigation} store={mockStore(initialState)} clearErrors={clearErrors} getNearbyStops={jest.fn()} />).dive();
        ListItem = wrapper.find('FlatList').last().props().renderItem({ item: { busStop: 'Centralstationen', id: '1' } });
        Keyboard.dismiss.reset();
        clearErrors.reset();
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
            expect(navigation.navigate).toBeCalledWith('Departures',
                {
                    busStop: 'Centralstationen',
                    id: '1',
                    title: 'Centralstationen',
                    parent: 'favorites',
                }
            );
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
