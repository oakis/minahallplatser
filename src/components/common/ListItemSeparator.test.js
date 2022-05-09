import React from 'react';
import {render} from '@testing-library/react-native';
import {ListItemSeparator} from './ListItemSeparator';

it('should match snapshot', () => {
  const {toJSON} = render(<ListItemSeparator />);
  expect(toJSON()).toMatchSnapshot();
});
