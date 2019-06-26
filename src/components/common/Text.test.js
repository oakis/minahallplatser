import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Text } from './Text';

it('should match snapshot without styles', () => {
    const wrapper = shallow(<Text />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('should match snapshot with array styles', () => {
    const wrapper = shallow(<Text style={[{ color: '#abc' }, { backgroundColor: '#def' }]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
});
