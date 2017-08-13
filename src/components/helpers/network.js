export const convertJSON = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};
