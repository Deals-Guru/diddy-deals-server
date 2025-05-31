const serverless = require('serverless-http');
const app = require('../../index');

exports.handler = async (event, context) => {
  // Handle preflight requests directly
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin'
      },
      body: ''
    };
  }

  // Process regular requests
  try {
    const response = await serverless(app)(event, context);
    // Ensure CORS headers are present in all responses
    return {
      ...response,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      }
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      }
    };
  }
};