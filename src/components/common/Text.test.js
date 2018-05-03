import React from 'react';
import { shallow } from 'enzyme';
import { Text } from './Text';

it('should match snapshot without styles', () => {
    const wrapper = shallow(<Text />);
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot with array styles', () => {
    const wrapper = shallow(<Text style={[{ color: '#abc' }, { backgroundColor: '#def' }]} />);
    expect(wrapper).toMatchSnapshot();
});
