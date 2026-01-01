exports.handler = async (event) => {
    const ip = event.queryStringParameters.ip || '';
    const apiKey = process.env.IPINFO_API_TOKEN;

    const forwardedFor = event.headers["x-forwarded-for"] || "";
    const clientIp = forwardedFor.split(",")[0].trim();

    const url = `https://ipinfo.io/${clientIp}?token=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
    
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    };
};