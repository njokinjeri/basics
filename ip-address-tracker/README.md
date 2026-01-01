# IP Address Tracker

A web application that displays IP address information and approximate geolocation data. The app runs with an Express backend in local development and uses Netlify Serverless Functions in production.

## Live Site
[View Ip Address Tracker](https://ip-address-tracker-demo.netlify.app/)

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Backend (Local)**: Node.js, Express
- **Backend (Production)**: Netlify Serverless Functions
- **API**: IPinfo API

## Deployment Notes

This project uses different backend strategies depending on the environment:

- Local development uses an Express server to proxy requests to the IPinfo API.

- Production deployment uses Netlify Serverless Functions to handle IP lookups securely.

This approach ensures API keys are never exposed to the client side.

*Note: IP-based geolocation is approximate and depends on network routing, proxies, and ISP data. Results may differ between local and deployed environments.*

### Local Development
1. Install dependencies: `npm install`
2. Create `.env` file with `IPINFO_API_TOKEN=your_api_key_here`
3. Run server: `node server.js`
4. Open `http://localhost:3001`

## Deploying to Netlify

In production, the Express server is replaced by Netlify Serverless Functions.

Key configuration (netlify.toml):

- Publish directory: public

- Functions directory: netlify/functions

Environment Variables

- The following environment variable must be set in the Netlify dashboard: *IPINFO_API_TOKEN*

The Netlify Function reads the client IP from forwarded request headers and queries the IPinfo API server-side to keep the API token secure.