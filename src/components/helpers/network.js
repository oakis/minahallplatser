export const handleVasttrafikFetch = (response) => {
    console.log(response);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};
