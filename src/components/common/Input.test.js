import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Input } from './Input';

it('should match snapshot', () => {
    const wrapper = shallow(<Input
        label="text"
        icon="mail"
        iconRight="vpn-key"
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
});
