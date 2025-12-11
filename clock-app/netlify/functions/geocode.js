exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { latitude, longitude } = JSON.parse(event.body);
    
    if (!latitude || !longitude) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Latitude and longitude required' })
      };
    }

    const API_KEY = process.env.OPENCAGE_API_KEY;
    
    if (!API_KEY) {
      console.error('API key not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    const query = `${latitude}, ${longitude}`;
    const api_url = `https://api.opencagedata.com/geocode/v1/json?key=${API_KEY}&q=${encodeURIComponent(query)}&no_annotations=1`;
    
    const response = await fetch(api_url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to geocode location' })
    };
  }
};