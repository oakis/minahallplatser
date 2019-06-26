import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ListItem } from './ListItem';

it('should match snapshot', () => {
    const wrapper = shallow(<ListItem />);
    expect(toJson(wrapper)).toMatchSnapshot();
});
