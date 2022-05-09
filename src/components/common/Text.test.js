import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from './Text';

it('should match snapshot without styles', () => {
  const {toJSON} = render(<Text />);
  expect(toJSON()).toMatchSnapshot();
});

it('should match snapshot with array styles', () => {
  const {toJSON} = render(
    <Text style={[{color: '#abc'}, {backgroundColor: '#def'}]} />,
  );
  expect(toJSON()).toMatchSnapshot();
});
