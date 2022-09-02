/*
 * Interact with GraphQL Data From Server
 */
export async function getData(query) {
    const endpoint = `/api/graphql`;
    // console.log('query : ' + query.query);
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(query)
        });
        return response.json();
    } catch (e) {
        return e;
    }
}
