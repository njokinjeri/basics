exports.handler = async (event) => {
    const searchedIp = event.queryStringParameters.ip && event.queryStringParameters.ip ? event.queryStringParameters.ip.trim() : '';
    const apiKey = process.env.IPINFO_API_TOKEN;

    const forwardedFor = event.headers["x-forwarded-for"] || "";
    const clientIp = forwardedFor.split(",")[0].trim();

    const targetIp = searchedIp || clientIp;

    const url = `https://ipinfo.io/${targetIp}?token=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`IPInfo API returned status ${response.status}`)
        }
        const data = await response.json();
    
        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        }
    };
};