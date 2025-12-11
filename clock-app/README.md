# Clock App
A dynamic clock application with time-based greetings, background wallpapers, and geolocation features.

## Live Site
[View Clock App](https://bejewelled-shortbread-b8d056.netlify.app/)

## Tech Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Netlify Serverless Functions
- **API**: OpenCage Geocoding API

## Deployment Notes
This project includes serverless backend functionality for secure API key management. The geolocation feature uses a Netlify Function to handle API requests server-side, keeping the API key secure.

### Local Development
1. Install dependencies: `npm install`
2. Create `.env` file with `OPENCAGE_API_KEY=your_key_here`
3. Run server: `node server.js`
4. Open `http://localhost:3000`

### Deploying to Netlify
This project uses Netlify's serverless functions. Key configuration in `netlify.toml`:
- Base directory: `clock-app`
- Publish directory: `public`
- Functions directory: `netlify/functions`

Environment variable needed: `OPENCAGE_API_KEY`

## Credits
- **Wallpapers**: [Alpha Coders - Frieren Collection](https://alphacoders.com/frieren-(frieren-beyond-journeys-end)-wallpapers)
- **Challenge**: [Frontend Mentor](https://www.frontendmentor.io/challenges/clock-app-LMFaxFwrM)