import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import ShowDepartures from './ShowDepartures';
import { navigation } from './helpers/testhelper.js';

const mockStore = configureMockStore();

const initialState = {
    fav: {
        lines: [
            '16 Högsbo',
        ],
    },
    departures: {
        departures: [
            {
                sname: '16X',
                direction: 'Högsbo',
                clockLeft: '16:00',
                clockNext: '16:05',
                timeLeft: '3',
                timeNext: '8',
                isLive: true,
                fgColor: '#eee',
                bgColor: '#000',
                type: 'BUS',
                via: 'via Centralstationen',
                track: 'A',
                night: false,
                accessibility: 'wheelChair',
                journeyid: '123',
            }
        ],
        loading: false,
    },
    errors: {
        error: '',
    },
    settings: {
        timeFormat: '',
    },
};

it('should match snapshot', () => {
    const wrapper = shallow(<ShowDepartures navigation={navigation} store={mockStore(initialState)} getDepartures={jest.fn()} incrementStopsOpened={jest.fn()} />).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('16 Högsbo should match 16X Högsbo', () => {
    const wrapper = shallow(<ShowDepartures navigation={navigation} store={mockStore(initialState)} />);
    const expected = '16X';
    const actual = wrapper.props().favorites[0].sname;
    expect(actual).toBe(expected);
});

it('16X Högsbo should match 16 Högsbo', () => {
    initialState.fav.lines = ['16X Högsbo'];
    initialState.departures.departures = [
        {
            sname: '16',
            direction: 'Högsbo'
        }
    ];
    const wrapper = shallow(<ShowDepartures navigation={navigation} store={mockStore(initialState)} />);
    const expected = '16';
    const actual = wrapper.props().favorites[0].sname;
    expect(actual).toBe(expected);
});
