import React from 'react';
import {render} from '@testing-library/react-native';
import {Popup} from './Popup';

it('should match snapshot when visible', () => {
  const {toJSON} = render(<Popup />);
  expect(toJSON()).toMatchSnapshot();
});

it('should match snapshot when not visible', () => {
  const {toJSON} = render(<Popup isVisible={true} />);
  expect(toJSON()).toMatchSnapshot();
});
