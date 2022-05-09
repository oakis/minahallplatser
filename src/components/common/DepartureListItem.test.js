import React from 'react';
import {render} from '@testing-library/react-native';
import {DepartureListItem} from './DepartureListItem';

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
  journeyid: '123',
  global: true,
  local: true,
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
  global: false,
  local: true,
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
  global: true,
  local: false,
};

it('should match snapshot for extra lines', () => {
  const {toJSON} = render(
    <DepartureListItem
      item={item}
      onPress={jest.fn()}
      onLongPress={jest.fn()}
    />,
  );
  expect(toJSON()).toMatchSnapshot();
});

it('should match snapshot for boats', () => {
  const {toJSON} = render(
    <DepartureListItem
      item={item2}
      onPress={jest.fn()}
      onLongPress={jest.fn()}
    />,
  );
  expect(toJSON()).toMatchSnapshot();
});

it('should match snapshot for trains', () => {
  const {toJSON} = render(
    <DepartureListItem
      item={item3}
      onPress={jest.fn()}
      onLongPress={jest.fn()}
    />,
  );
  expect(toJSON()).toMatchSnapshot();
});
