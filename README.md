# UIUC Course Chat - Canvas Integration

A simple chat interface that can be embedded in Canvas courses to provide AI-powered course assistance.

## Setup Instructions

1. Clone this repository
2. Create a `config.js` file in the root directory with the following content:
```javascript
const config = {
    API_KEY: 'YOUR_API_KEY_HERE'
};
```
3. Replace 'YOUR_API_KEY_HERE' with your actual UIUC Chat API key
4. Host the files on a web server (e.g., GitHub Pages, Netlify, etc.)

## Canvas Integration

1. Go to Canvas Settings > Apps > View App Configurations
2. Click "+ App"
3. Choose "By URL"
4. Fill in:
   - Name: UIUC Course Chat
   - URL: YOUR_HOSTED_URL
   - Consumer Key: (leave blank)
   - Shared Secret: (leave blank)
   - Config URL: (leave blank)

## Security Note
The `config.js` file is ignored by git to prevent exposing API keys. Make sure to:
1. Never commit the `config.js` file
2. Keep your API key secure
3. Use environment variables in production