import React from 'react';
import { shallow } from 'enzyme';
import firebase from 'react-native-firebase';
import { Feedback } from './Feedback';
import { track } from '../helpers';

it('should match snapshot', () => {
    const wrapper = shallow(<Feedback />);
    expect(wrapper).toMatchSnapshot();
});

it('reset() should reset to initial state', () => {
    firebase.auth = () => ({ currentUser: { email: 'abc@123.com' } });
    const wrapper = shallow(<Feedback />);
    const initialState = wrapper.state();
    wrapper.setState({
        loading: true,
        name: 'abc',
        email: 'qwerty@asd.com',
        message: 'asdasd',
        validated: false
    });
    wrapper.instance().reset();
    expect(wrapper.state()).toEqual(initialState);
});

it('validate() should return true if all fields are filled in', () => {
    const wrapper = shallow(<Feedback />);
    expect(wrapper.instance().validate()).toBe(false);
    wrapper.setState({
        name: 'abc',
        email: 'abc@123.com',
        message: 'asdasd',
    });
    expect(wrapper.instance().validate()).toBe(true);
});

it('typing name should fire onChangeName and set correct state', () => {
    const wrapper = shallow(<Feedback />);
    const input = wrapper.find('Input').at(0);
    input.simulate('changeText', 'My Name');
    expect(wrapper.state()).toEqual(expect.objectContaining({ name: 'My Name', validated: true }));
});

it('typing email should fire onChangeEmail and set correct state', () => {
    const wrapper = shallow(<Feedback />);
    const input = wrapper.find('Input').at(1);
    input.simulate('changeText', 'my@email.com');
    expect(wrapper.state()).toEqual(expect.objectContaining({ email: 'my@email.com', validated: true }));
});

it('typing message should fire onChangeMessage and set correct state', () => {
    const wrapper = shallow(<Feedback />);
    const input = wrapper.find('Input').at(2);
    input.simulate('changeText', 'my message');
    expect(wrapper.state()).toEqual(expect.objectContaining({ message: 'my message', validated: true }));
});

describe('press avbryt button', () => {
    let wrapper;
    const close = jest.fn();
    beforeEach(() => {
        track.mockClear();
        close.mockClear();
        wrapper = shallow(<Feedback close={close} />);
        wrapper.find('Button').at(1).simulate('press');
    });

    it('should fire this.props.close', () => {
        expect(close).toHaveBeenCalledTimes(1);
    });

    it('should be tracked', () => {
        expect(track).toBeCalledWith('Feedback Cancel');
    });
});

describe('press skicka feedback button', () => {
    let wrapper;
    beforeEach(() => {
        track.mockClear();
        wrapper = shallow(<Feedback />).setState({ name: 'A', email: 'B', message: 'C' });
        wrapper.instance().setState = jest.fn();
        wrapper.find('Button').at(0).simulate('press');
    });

    it('should indicate loading', () => {
        expect(wrapper.instance().setState).toBeCalledWith({ loading: true });
    });
});
