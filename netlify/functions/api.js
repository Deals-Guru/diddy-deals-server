const serverless = require('serverless-http');
const app = require('../../index');

const allowedOrigins = [
  'http://localhost:3001',
  'https://fancy-alfajores-b52bf1.netlify.app',
  '*'
];

module.exports.handler = async (event, context) => {
  // Handle OPTIONS requests (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      },
      body: ''
    };
  }

  // Process the request
  try {
    const handler = serverless(app);
    const response = await handler(event, context);
    
    // Add CORS headers to the response
    const origin = event.headers.origin || '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'
    };

    return {
      ...response,
      headers: {
        ...(response.headers || {}),
        ...corsHeaders
      }
    };
  } catch (error) {
    console.error('Handler error:', error);
    
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message || 'Internal Server Error'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      }
    };
  }
};