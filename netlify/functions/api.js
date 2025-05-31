// netlify/functions/api.js
const app = require('../../index');
const allowedOrigins = [
  'http://localhost:3001',
  'https://fancy-alfajores-b52bf1.netlify.app'
];

exports.handler = async (event, context) => {
  // Handle OPTIONS requests (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      },
      body: ''
    };
  }

  // Prepare Express request
  const request = {
    method: event.httpMethod,
    path: event.path.replace('/.netlify/functions/api', ''),
    headers: event.headers,
    query: event.queryStringParameters,
    body: event.body
  };

  // Handle Express response
  return new Promise((resolve) => {
    const response = {
      statusCode: 200,
      headers: {},
      setHeader: (key, value) => (response.headers[key] = value),
      end: (body) => {
        const origin = request.headers.origin || '';
        
        // Add CORS headers
        response.headers['Access-Control-Allow-Origin'] = 
          allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
        response.headers['Access-Control-Allow-Credentials'] = 'true';
        response.headers['Vary'] = 'Origin';
        
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: body
        });
      }
    };

    // Simulate Express request handling
    app(request, response);
  }).catch(error => {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigins.includes(request.headers.origin) 
          ? request.headers.origin : allowedOrigins[0],
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      },
      body: JSON.stringify({ error: error.message })
    };
  });
};