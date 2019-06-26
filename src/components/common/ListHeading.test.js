import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ListHeading } from './ListHeading';

it('should match snapshot', () => {
    const wrapper = shallow(<ListHeading />);
    expect(toJson(wrapper)).toMatchSnapshot();
});
