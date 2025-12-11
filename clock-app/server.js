require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.static('public'));

app.use(cors());

app.post('/api/geocode', async(req, res) => {
    try {
        const {latitude, longitude} = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude required' });
        }
        const API_KEY = process.env.OPENCAGE_API_KEY;
        const query = `${latitude}, ${longitude}`;
        const api_url = `https://api.opencagedata.com/geocode/v1/json?key=${API_KEY}&q=${encodeURIComponent(query)}&no_annotations=1`;

        const response = await fetch(api_url);
        const data = await response.json();

        res.json(data);
        
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ error: 'Failed to geocode location'});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
