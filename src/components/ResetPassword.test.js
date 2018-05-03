import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ResetPassword from './ResetPassword';


const mockStore = configureMockStore([thunk]);

const initialState = {
    auth: {
        email: 'abc@123.com',
        loading: false,
    },
    errors: {
        error: 'An error message',
    },
};

it('should match snapshot', () => {
    const wrapper = shallow(<ResetPassword store={mockStore(initialState)} resetRoute={jest.fn()} />).dive();
    expect(wrapper).toMatchSnapshot();
});
