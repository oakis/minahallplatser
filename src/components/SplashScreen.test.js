import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SplashScreen from './SplashScreen';

const mockStore = configureMockStore([thunk]);

global.window.log = () => {};

describe('SplashScreen', () => {
    it('should match snapshot', async () => {
        const wrapper = await shallow(<SplashScreen store={mockStore()} />);
        expect(wrapper.dive()).toMatchSnapshot();
    });
});
