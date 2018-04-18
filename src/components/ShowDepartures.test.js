import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import ShowDepartures from './ShowDepartures';

const mockStore = configureMockStore();

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
