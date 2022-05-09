import React from 'react';
import {render} from '@testing-library/react-native';
import SplashScreen from './SplashScreen';

describe('SplashScreen', () => {
  it('should match snapshot', async () => {
    const {toJSON} = render(<SplashScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
