import _ from 'lodash';
import {
  FAVORITE_CREATE,
  FAVORITE_DELETE,
  FAVORITE_OPENED,
  LINE_ADD,
  LINE_REMOVE,
  LINE_LOCAL_ADD,
  LINE_LOCAL_REMOVE,
} from '@types';

const INIT_STATE = {
  favorites: [],
  lines: [],
  linesLocal: [],
  loading: true,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FAVORITE_CREATE:
      return {...state, favorites: [...state.favorites, action.payload]};
    case FAVORITE_DELETE:
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload),
      };
    case FAVORITE_OPENED:
      return {
        ...state,
        favorites: state.favorites.map((fav, i) => {
          const currentOpened = state.favorites[i].opened;
          return {
            ...fav,
            opened:
              action.payload === fav.id
                ? (currentOpened || 0) + 1
                : currentOpened || 0,
          };
        }),
      };
    case LINE_ADD:
      return {...state, lines: [...state.lines, action.payload]};
    case LINE_REMOVE:
      return {
        ...state,
        lines: state.lines.filter(line => line !== action.payload),
      };
    case LINE_LOCAL_ADD: {
      const existingStop = _.find(
        state.linesLocal,
        ({stop}) => stop === action.payload.stop,
      );
      if (!state.linesLocal || !state.linesLocal.length) {
        return {
          ...state,
          linesLocal: [
            {
              stop: action.payload.stop,
              lines: [action.payload.line],
            },
          ],
        };
      } else if (
        existingStop &&
        _.includes(existingStop, action.payload.stop)
      ) {
        return {
          ...state,
          linesLocal: state.linesLocal.map(line => {
            if (line.stop === action.payload.stop) {
              return {
                ...line,
                lines: [...line.lines, action.payload.line],
              };
            }
            return line;
          }),
        };
      }
      return {
        ...state,
        linesLocal: [
          ...state.linesLocal,
          {
            stop: action.payload.stop,
            lines: [action.payload.line],
          },
        ],
      };
    }
    case LINE_LOCAL_REMOVE:
      return {
        ...state,
        linesLocal: state.linesLocal.map(line => {
          if (line.stop === action.payload.stop) {
            return {
              ...line,
              lines: line.lines.filter(str => str !== action.payload.line),
            };
          }
          return line;
        }),
      };
    default:
      return state;
  }
};
