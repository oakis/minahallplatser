import firebase from 'react-native-firebase';

export const handleJsonFetch = (response) => {
    window.log(`handleJsonFetch() - Status: ${response.status} - ok: ${response.ok}`);
    if (response.status === 200) {
        return response.json()
            .then((data) => {
                window.log('handleJsonFetch(): OK', data);
                return data;
            })
            .catch((err) => err);
    } else if (response.status === 400) {
        return response.json()
        .then((data) => {
            window.log('handleJsonFetch(): Error', data);
            firebase.crashlytics().recordError(data.StackTraceString);
            throw data.Message;
        });
    } else if (response.status === 404) {
        return response.json()
        .then((data) => {
            window.log('handleJsonFetch(): Error', data);
            throw data.message || data;
        });
    }
    const error = response.statusText || response.message || 'Det gick inte att ansluta till Mina Hållplatser. Kontrollera din anslutning.';
    window.log('handleJsonFetch(): Error', error, response);
    throw error;
};
