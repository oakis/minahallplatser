import moment from 'moment';

let tokenExpires = moment();

export const tokenNeedsRefresh = () => {
    console.log('tokenNeedsRefresh()', tokenExpires.diff(moment()) / 1000 < 0);
    return tokenExpires.diff(moment()) / 1000 < 0;
};

export const saveTokenExpires = (token) => {
    tokenExpires = moment().add(token.expires_in, 'seconds');
    console.log('saveTokenExpires()', tokenExpires.format('YYYY-MM-DD HH:mm'));
};

export const tokenWillExpireIn = () => {
    console.log('tokenWillExpireIn()', tokenExpires.diff(moment()) / 1000);
    return tokenExpires.diff(moment()) / 1000;
};
