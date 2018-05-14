import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import RegisterForm from './RegisterForm';


const mockStore = configureMockStore([thunk]);

const initialState = {
    auth: {
        email: 'abc@123.com',
        password: 'abc123',
        passwordSecond: 'abc123',
        loading: false,
        loadingFacebook: false,

    },
    errors: {
        error: 'An error message',
    },
    fav: {
        favorites: [],
        lines: [],
    }
};

it('should match snapshot', () => {
    const wrapper = shallow(<RegisterForm store={mockStore(initialState)} resetRoute={jest.fn()} />).dive();
    expect(wrapper).toMatchSnapshot();
});
