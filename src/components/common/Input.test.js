import React from 'react';
import { shallow } from 'enzyme';
import { Input } from './Input';

it('should match snapshot', () => {
    const wrapper = shallow(<Input
        label="text"
        icon="ios-mail"
        iconRight="ios-key"
    />);
    expect(wrapper).toMatchSnapshot();
});
