import React from 'react';
import { shallow } from 'enzyme';
import { ListItem } from './ListItem';

it('should match snapshot', () => {
    const wrapper = shallow(<ListItem />);
    expect(wrapper).toMatchSnapshot();
});
