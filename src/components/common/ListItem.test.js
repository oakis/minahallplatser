import React from 'react';
import {render} from '@testing-library/react-native';
import {ListItem} from './ListItem';

it('should match snapshot', () => {
  const {toJSON} = render(<ListItem />);
  expect(toJSON()).toMatchSnapshot();
});
