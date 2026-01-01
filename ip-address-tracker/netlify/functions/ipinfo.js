exports.handler = async (event) => {
    const ip = event.queryStringParameters.ip || '';
    const apiKey = process.env.IPINFO_API_TOKEN;

    const url = `https://ipinfo.io${ip}?token=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
    
        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    };
};