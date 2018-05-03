import React from 'react';
import { shallow } from 'enzyme';
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
    night: false,
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
    night: true,
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
    night: false,
    accessibility: null,
    journeyid: '123',
    timeFormat: 'minutes',
};

it('should match snapshot', () => {
    const wrapper = shallow(<DepartureListItem item={item} />);
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<DepartureListItem item={item2} />);
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot', () => {
    const wrapper = shallow(<DepartureListItem item={item3} />);
    expect(wrapper).toMatchSnapshot();
});
