export const handleVasttrafikFetch = (response) => {
    console.log(`handleVasttrafikFetch() - Status: ${response.status} - ok: ${response.ok} - statusText: ${response.statusText}`);
    console.log(response);
    if (!response.ok) throw response.statusText || 'Det gick inte att ansluta till Mina Hållplatser. Kontrollera din anslutning.';
    return response.json();
};
