const serverless = require('serverless-http');
// netlify/functions/api.js
const app = require('../../index');

// Manual request handler
exports.handler = async (event, context) => {
  // Handle OPTIONS requests directly
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      },
      body: ''
    };
  }

  // Convert Netlify event to Express request
  const request = {
    method: event.httpMethod,
    path: event.path.replace('/.netlify/functions/api', ''),
    query: event.queryStringParameters,
    headers: event.headers,
    body: event.body,
    rawUrl: event.rawUrl
  };

  // Create mock response object
  return new Promise((resolve) => {
    const response = {
      statusCode: 200,
      headers: {},
      setHeader: (key, value) => (response.headers[key] = value),
      end: (body) => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: body
        });
      }
    };

    // Simulate Express handling
    app(request, response, () => {
      response.statusCode = 404;
      response.end('Not Found');
    });
  }).then(result => {
    // Ensure CORS headers are present
    return {
      ...result,
      headers: {
        ...result.headers,
        'Access-Control-Allow-Origin': event.headers.origin || 'http://localhost:3001',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      }
    };
  }).catch(error => {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': event.headers.origin || 'http://localhost:3001',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      }
    };
  });
};