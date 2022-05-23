import _ from 'lodash';
import {Dispatch} from 'redux';
import {store} from '@src/App';
import {
  FAVORITE_CREATE,
  FAVORITE_DELETE,
  FAVORITE_OPENED,
  LINE_ADD,
  LINE_REMOVE,
  LINE_LOCAL_ADD,
  LINE_LOCAL_REMOVE,
} from '@types';
import {track} from '@helpers';

// Stops

export const favoriteCreate = (payload: Record<string, string>) => {
  window.log('favoriteCreate():', payload.id);
  return (dispatch: Dispatch) => {
    dispatch({type: FAVORITE_CREATE, payload});
  };
};

export const favoriteDelete = (stopId: string) => {
  window.log('favoriteDelete():', stopId);
  return (dispatch: Dispatch) => {
    dispatch({type: FAVORITE_DELETE, payload: stopId});
  };
};

export const incrementStopsOpened = (stopId: string) => {
  window.log('incrementStopsOpened()', stopId);
  return (dispatch: Dispatch) => {
    dispatch({type: FAVORITE_OPENED, payload: stopId});
  };
};

// Lines

interface LineProps {
  sname: string;
  direction: string;
}

export const favoriteLineToggle = ({sname, direction}: LineProps) => {
  const line = `${sname} ${direction}`;
  return (dispatch: Dispatch) => {
    if (_.includes(store.getState().fav.lines, line)) {
      track('Favorite Line Remove', {Line: line});
      dispatch({type: LINE_REMOVE, payload: line});
    } else {
      track('Favorite Line Add', {Line: line});
      dispatch({type: LINE_ADD, payload: line});
    }
  };
};

export const favoriteLineLocalAdd = (
  {sname, direction}: LineProps,
  stop: string,
) => {
  const line = `${sname} ${direction}`;
  return (dispatch: Dispatch) => {
    track('Favorite Line Local Add', {Line: line, Stop: stop});
    dispatch({type: LINE_LOCAL_ADD, payload: {line, stop}});
  };
};

export const favoriteLineLocalRemove = (
  {sname, direction}: LineProps,
  stop: string,
) => {
  const line = `${sname} ${direction}`;
  return (dispatch: Dispatch) => {
    track('Favorite Line Local Remove', {Line: line, Stop: stop});
    dispatch({type: LINE_LOCAL_REMOVE, payload: {line, stop}});
  };
};
