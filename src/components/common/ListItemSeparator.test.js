import React from 'react';
import { shallow } from 'enzyme';
import { ListItemSeparator } from './ListItemSeparator';

it('should match snapshot', () => {
    const wrapper = shallow(<ListItemSeparator />);
    expect(wrapper).toMatchSnapshot();
});
