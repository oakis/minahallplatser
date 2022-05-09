import React from 'react';
import {render} from '@testing-library/react-native';
import {ListHeading} from './ListHeading';

it('should match snapshot', () => {
  const {toJSON} = render(<ListHeading />);
  expect(toJSON()).toMatchSnapshot();
});
