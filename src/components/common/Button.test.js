import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {isAndroid} from '../helpers';
import {Button} from './';

it('should match snapshot on Android', () => {
  isAndroid.mockImplementationOnce(() => true);
  const {toJSON} = render(<Button />);
  expect(toJSON()).toMatchSnapshot();
});

it('should match snapshot on iOS', () => {
  isAndroid.mockImplementationOnce(() => false);
  const {toJSON} = render(<Button />);
  expect(toJSON()).toMatchSnapshot();
});

it('should fire callback function onPress on Android', () => {
  isAndroid.mockImplementationOnce(() => true);
  const onPress = jest.fn();
  const {getByText} = render(<Button label="Stäng" onPress={onPress} />);
  fireEvent.press(getByText('Stäng'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('should fire callback function onPress on iOS', () => {
  isAndroid.mockImplementationOnce(() => false);
  const onPress = jest.fn();
  const {getByText} = render(<Button label="Stäng" onPress={onPress} />);
  fireEvent.press(getByText('Stäng'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
