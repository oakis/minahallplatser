import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ListItemSeparator } from './ListItemSeparator';

it('should match snapshot', () => {
    const wrapper = shallow(<ListItemSeparator />);
    expect(toJson(wrapper)).toMatchSnapshot();
});
