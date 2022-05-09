import React from 'react';
import {render} from '@testing-library/react-native';
import {Spinner} from './Spinner';

it('should match snapshot with no flex', () => {
  const {toJSON} = render(<Spinner noFlex left />);
  expect(toJSON()).toMatchSnapshot();
});

it('should match snapshot with flex', () => {
  const {toJSON} = render(<Spinner />);
  expect(toJSON()).toMatchSnapshot();
});
