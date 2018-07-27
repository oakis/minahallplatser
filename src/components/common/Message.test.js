import React from 'react';
import { shallow } from 'enzyme';
import { store } from '../../App';
import { Message } from './Message';

const types = ['info', 'success', 'danger', 'warning', null];

types.forEach(type => {
    it(`should match snapshot with type ${type}`, () => {
        const wrapper = shallow(<Message type={type} message="Message" />);
        expect(wrapper).toMatchSnapshot();
    });
});

it('should match snapshot with no message or type', () => {
    const wrapper = shallow(<Message />);
    expect(wrapper).toMatchSnapshot();
});

it('should clear errors onPress', () => {
    store.dispatch = jest.fn();
    const wrapper = shallow(<Message message="Message" />);
    const close = wrapper.find('DefaultFont').at(1);
    close.props().onPress();
    expect(store.dispatch).toBeCalledWith({ type: 'CLR_ERROR' });
});
