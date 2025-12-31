require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.static('public'));
app.use(cors());

app.get('/api/ipinfo', async (req, res) => {
    try {
        const ip = req.query.ip || '';
        const apiKey = process.env.IPINFO_API_TOKEN;
        
        
        const url = `https://ipinfo.io/${ip}?token=${apiKey}`;

        const response = await fetch(url);

        if(!response.ok) {
            throw new Error(`IPInfo API returned ${response.status}`);
        }

        const data = await response.json();
        res.json(data);


    } catch (error) {
        console.log('Error fetching IP data:', error)
        res.status(500).json({
            error: 'Failed to fetch IP information',
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));