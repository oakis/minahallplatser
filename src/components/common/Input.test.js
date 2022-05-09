import React from 'react';
import {Input} from './Input';
import {render} from '@testing-library/react-native';

it('should match snapshot', () => {
  const {toJSON} = render(
    <Input label="text" icon="mail" iconRight="vpn-key" />,
  );
  expect(toJSON()).toMatchSnapshot();
});
