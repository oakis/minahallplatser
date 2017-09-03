import moment from 'moment';

let time;

export const timeStart = () => {
    time = moment();
};

export const timeEnd = (type) => {
    window.log(`${type}: fetch took ${moment().diff(time)} milliseconds.`);
};
