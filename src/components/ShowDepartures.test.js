import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import ShowDepartures from './ShowDepartures';

const mockStore = configureMockStore();

jest.mock('react-native-router-flux', () => {});
jest.mock('react-native-vector-icons/Ionicons', () => {});
jest.mock('react-native-vector-icons/MaterialIcons', () => {});
jest.mock('react-native-device-info', () => {});
jest.mock('react-native-fabric', () => {});
jest.mock('react-native-fbsdk', () => (
    {
        Loginmanager: jest.fn(),
        AccessToken: jest.fn()
    }
));
jest.mock('react-native-mixpanel', () => (
    {
        sharedInstanceWithToken: jest.fn()
    }
));
jest.mock('react-native-geolocation-service', () => {});
jest.mock('react-native-vector-icons/FontAwesome', () => {});
jest.mock('react-native-vector-icons/Entypo', () => {});

describe('ShowDepartures', () => {
    it('16 Högsbo should match 16X Högsbo', () => {
        const initialState = {
            fav: {
                lines: [
                    '16 Högsbo'
                ]
            },
            departures: {
                departures: [
                    {
                        sname: '16X',
                        direction: 'Högsbo'
                    }
                ]
            },
            errors: {
                error: ''
            },
            settings: {
                timeFormat: ''
            }
        };
        const wrapper = shallow(<ShowDepartures store={mockStore(initialState)} />);
        const expected = '16X';
        const actual = wrapper.props().favorites[0].sname;
        expect(actual).toBe(expected);
    });

    it('16X Högsbo should match 16 Högsbo', () => {
        const initialState = {
            fav: {
                lines: [
                    '16X Högsbo'
                ]
            },
            departures: {
                departures: [
                    {
                        sname: '16',
                        direction: 'Högsbo'
                    }
                ]
            },
            errors: {
                error: ''
            },
            settings: {
                timeFormat: ''
            }
        };
        const wrapper = shallow(<ShowDepartures store={mockStore(initialState)} />);
        const expected = '16';
        const actual = wrapper.props().favorites[0].sname;
        expect(actual).toBe(expected);
    });
});
