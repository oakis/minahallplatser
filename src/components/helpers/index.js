export * from './device';
export * from './message';
export * from './network';
export * from './token';
export * from './analytics';
export * from './image';

export const isObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
