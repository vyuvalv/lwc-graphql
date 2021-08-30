/*
 * GET Data From Server
 */
export async function getData(topic) {
    const endpoint = `/api/v1/data?topic=${topic}`;
    try {
        const response = await fetch(endpoint);
        return response.json();
    } catch (e) {
        return e;
    }
}
/*
 * POST Data to Server
 */
export async function postData(topic, body) {
    const endpoint = `/api/v1/service/${topic}`;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        });
        return response.json();
    } catch (e) {
        return e;
    }
}