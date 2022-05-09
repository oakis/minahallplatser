import React from 'react';
import {render} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {Feedback} from './Feedback';
import {track} from '../helpers';

window.log = () => {};

it('should match snapshot', () => {
  const {toJSON} = render(<Feedback />);
  expect(toJSON()).toMatchSnapshot();
});

xit('reset() should reset to initial state', () => {
  const {toJSON} = render(<Feedback />);
  const initialState = wrapper.state();
  wrapper.setState({
    loading: true,
    name: 'abc',
    email: 'qwerty@asd.com',
    message: 'asdasd',
    validated: false,
  });
  wrapper.instance().reset();
  expect(wrapper.state()).toEqual(initialState);
});

xit('validate() should return true if all fields are filled in', () => {
  const {toJSON} = render(<Feedback />);
  expect(wrapper.instance().validate()).toBe(false);
  wrapper.setState({
    name: 'abc',
    email: 'abc@123.com',
    message: 'asdasd',
  });
  expect(wrapper.instance().validate()).toBe(true);
});

xit('typing name should fire onChangeName and set correct state', () => {
  const {toJSON} = render(<Feedback />);
  const input = wrapper.find('Input').at(0);
  input.simulate('changeText', 'My Name');
  expect(wrapper.state()).toEqual(
    expect.objectContaining({name: 'My Name', validated: true}),
  );
});

xit('typing email should fire onChangeEmail and set correct state', () => {
  const {toJSON} = render(<Feedback />);
  const input = wrapper.find('Input').at(1);
  input.simulate('changeText', 'my@email.com');
  expect(wrapper.state()).toEqual(
    expect.objectContaining({email: 'my@email.com', validated: true}),
  );
});

xit('typing message should fire onChangeMessage and set correct state', () => {
  const {toJSON} = render(<Feedback />);
  const input = wrapper.find('Input').at(2);
  input.simulate('changeText', 'my message');
  expect(wrapper.state()).toEqual(
    expect.objectContaining({message: 'my message', validated: true}),
  );
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

  xit('should fire this.props.close', () => {
    expect(close).toHaveBeenCalledTimes(1);
  });

  xit('should be tracked', () => {
    expect(track).toBeCalledWith('Feedback Cancel');
  });
});

describe('press skicka feedback button', () => {
  let wrapper;
  describe('validated + then', () => {
    beforeEach(async () => {
      track.mockClear();
      wrapper = await shallow(<Feedback />).setState({
        name: 'A',
        email: 'B',
        message: 'C',
      });
      wrapper.instance().reset = jest.fn();
      wrapper.instance().setState = jest.fn();
      wrapper.find('Button').at(0).simulate('press');
    });

    xit('should indicate loading', () => {
      expect(wrapper.instance().setState).toBeCalledWith({loading: true});
    });

    xit('should be tracked on success', () => {
      expect(track).toBeCalledWith('Feedback Send');
    });

    xit('should alert user that it was successful', () => {
      expect(Alert.alert).toBeCalledWith('', 'Tack för din feedback!');
    });

    xit('should reset state', () => {
      expect(wrapper.instance().reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('not validated', () => {
    beforeEach(async () => {
      fetch.mockImplementationOnce(() => ({
        finally: stub().rejects({err: 'err'}),
      }));
      track.mockClear();
      wrapper = await shallow(<Feedback />).setState({
        name: 'A',
        email: 'B',
        message: 'C',
      });
      wrapper.instance().reset = jest.fn();
      wrapper.instance().setState = jest.fn();
      wrapper.find('Button').at(0).simulate('press');
    });

    xit('should be tracked on fail', () => {
      expect(track).toBeCalledWith('Feedback Failed', {Error: {err: 'err'}});
    });

    xit('should alert the user about the error', () => {
      expect(Alert.alert).toBeCalledWith(
        '',
        'Något gick snett, försök igen senare.',
      );
    });

    xit('should stop indicating load', () => {
      expect(wrapper.instance().setState).toBeCalledWith({loading: false});
    });
  });

  xit('if not validated: set validated to false', async () => {
    wrapper = await shallow(<Feedback />);
    wrapper.instance().setState = jest.fn();
    wrapper.find('Button').at(0).simulate('press');
    expect(wrapper.instance().setState).toBeCalledWith({validated: false});
  });
});
