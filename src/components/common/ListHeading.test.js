import React from 'react';
import { shallow } from 'enzyme';
import { ListHeading } from './ListHeading';

it('should match snapshot', () => {
    const wrapper = shallow(<ListHeading />);
    expect(wrapper).toMatchSnapshot();
});
