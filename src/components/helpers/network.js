export const handleJsonFetch = (response) => {
    window.log(`handleJsonFetch() - Status: ${response.status} - ok: ${response.ok}`);
    if (!response.ok) {
        const error = response.statusText || 'Det gick inte att ansluta till Mina Hållplatser. Kontrollera din anslutning.';
        window.log('handleJsonFetch(): Error', error);
        throw error;
    }
    return response.json()
        .then((data) => {
            window.log('handleJsonFetch(): OK', data);
            return data;
        })
        .catch((err) => err);
};
