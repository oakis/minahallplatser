import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {store} from '../../App';
import {Message} from './Message';
import {colors} from '../style';

const types = ['info', 'success', 'danger', 'warning', null];

types.forEach(type => {
  it(`should match snapshot with type ${type}`, () => {
    const {toJSON} = render(
      <Message type={type} message="Message" backgroundColor={colors[type]} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

it('should match snapshot with no message or type', () => {
  const {toJSON} = render(<Message />);
  expect(toJSON()).toMatchSnapshot();
});

it('should clear errors onPress', () => {
  store.dispatch = jest.fn();
  const {getByText} = render(<Message message="Message" />);
  fireEvent.press(getByText('Stäng'));
  expect(store.dispatch).toBeCalledWith({type: 'CLR_ERROR'});
});
