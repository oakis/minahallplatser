import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Spinner } from './Spinner';

it('should match snapshot with no flex', () => {
    const wrapper = shallow(<Spinner noFlex left />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('should match snapshot with flex', () => {
    const wrapper = shallow(<Spinner />);
    expect(toJson(wrapper)).toMatchSnapshot();
});
