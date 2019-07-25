import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { stub } from 'sinon';
import Menu from './Menu';


const mockStore = configureMockStore([thunk]);

const initialState = {
    settings: {
        timeFormat: 'minutes',
        favoriteOrder: 'nothing',
        allowedGPS: true,
    }
};


const setSetting = stub();
beforeEach(() => {
    setSetting.reset();
});

it('should match snapshot', () => {
    const wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('openFeedback should set feedbackVisible to true', () => {
    const wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
    wrapper.instance().openFeedback();
    expect(wrapper.state().feedbackVisible).toBe(true);
});

it('closeFeedback should set feedbackVisible to false', () => {
    const wrapper = shallow(<Menu store={mockStore(initialState)} />).dive();
    wrapper.setState({ feedbackVisible: true });
    wrapper.instance().closeFeedback();
    expect(wrapper.state().feedbackVisible).toBe(false);
});
