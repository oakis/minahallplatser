import moment from 'moment';

let tokenExpires = moment();

export const tokenNeedsRefresh = () => {
    return tokenExpires.diff(moment()) / 1000 < 0;
};

export const saveTokenExpires = (token) => {
    tokenExpires = moment().add(token.expires_in, 'seconds');
};
