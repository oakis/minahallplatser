import React from 'react';
import {Input} from './Input';
import {render} from '@testing-library/react-native';

test('should match snapshot', () => {
  const {toJSON, container} = render(
    <Input label="text" icon="mail" iconRight="vpn-key" />,
  );
  console.log(container);
  expect(toJSON()).toMatchSnapshot();
});
