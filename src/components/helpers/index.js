export * from './device';
export * from './message';
export * from './network';
export * from './token';
export * from './firebase';
export * from './analytics';
export * from './globals';
export * from './image';

export const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
