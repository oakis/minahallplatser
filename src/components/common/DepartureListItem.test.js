import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DepartureListItem } from './DepartureListItem';

const item = {
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
    accessibility: 'wheelChair',
    journeyid: '123'
};

const item2 = {
    sname: 'SVART',
    direction: 'Högsbo',
    clockLeft: '16:00',
    clockNext: '16:05',
    timeLeft: '0',
    timeNext: '8',
    isLive: true,
    fgColor: '#eee',
    bgColor: '#000',
    type: 'BOAT',
    via: '',
    track: '',
    accessibility: null,
    journeyid: '123',
    index: 1,
    timeFormat: '',
};

const item3 = {
    sname: '1',
    direction: 'Centralstationen',
    clockLeft: '16:00',
    clockNext: '16:05',
    timeLeft: '60',
    timeNext: '8',
    isLive: false,
    fgColor: '#eee',
    bgColor: '#000',
    type: 'VAS',
    via: '',
    track: '',
    accessibility: null,
    journeyid: '123',
    timeFormat: 'minutes',
};

it('should match snapshot', () => {
    const wrapper = shallow(<DepartureListItem item={item} onPress={jest.fn()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<DepartureListItem item={item2} onPress={jest.fn()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<DepartureListItem item={item3} onPress={jest.fn()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
});
