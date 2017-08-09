import moment from 'moment';

let time;

export const timeStart = () => {
    time = moment();
};

export const timeEnd = (type) => {
    console.log(`${type}: fetch took ${moment().diff(time)} milliseconds.`);
};
