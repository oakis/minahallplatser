import { Crashlytics } from 'react-native-fabric';
export const handleJsonFetch = (response) => {
    window.log(`handleJsonFetch() - Status: ${response.status} - ok: ${response.ok}`);
    if (response.status == 200) {
        return response.json()
            .then((data) => {
                window.log('handleJsonFetch(): OK', data);
                return data;
            })
            .catch((err) => err);
    } else if (response.status == 400) {
        return response.json()
        .then((data) => {
            window.log('handleJsonFetch(): Error', data);
            Crashlytics.logException(data.StackTraceString);
            throw data.Message;
        })
     } else if (response.status == 404) {
        return response.json()
        .then((data) => {
            window.log('handleJsonFetch(): Error', data);
            throw data.data || data;
        })
    } else {
        const error = response.statusText || response.Message || 'Det gick inte att ansluta till Mina Hållplatser. Kontrollera din anslutning.';
        window.log('handleJsonFetch(): Error', error);
        throw error;
    }
};
