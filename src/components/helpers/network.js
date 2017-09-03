export const handleVasttrafikFetch = (response) => {
    window.log(`handleVasttrafikFetch() - Status: ${response.status} - ok: ${response.ok}`);
    if (!response.ok) {
        const error = response.statusText || 'Det gick inte att ansluta till Mina Hållplatser. Kontrollera din anslutning.';
        window.log('handleVasttrafikFetch(): Error', error);
        throw error;
    }
    return response.json()
        .then((data) => {
            window.log('handleVasttrafikFetch(): OK', data);
            return data;
        })
        .catch((err) => err);
};
