import React from 'react';
import { shallow } from 'enzyme';
import { Spinner } from './Spinner';

it('should match snapshot with no flex', () => {
    const wrapper = shallow(<Spinner noFlex left />);
    expect(wrapper).toMatchSnapshot();
});

it('should match snapshot with flex', () => {
    const wrapper = shallow(<Spinner />);
    expect(wrapper).toMatchSnapshot();
});
