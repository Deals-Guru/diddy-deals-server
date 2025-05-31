// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../index');

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3001',
  'https://fancy-alfajores-b52bf1.netlify.app'
];

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      },
      body: ''
    };
  }

  // Process regular requests
  const response = await serverless(app)(event, context);
  
  // Add CORS headers to all responses
  const origin = event.headers.origin;
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };

  return {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders
    }
  };
};