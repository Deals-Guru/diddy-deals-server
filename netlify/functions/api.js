// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../index');

const allowedOrigins = [
  'http://localhost:3001',
  'https://fancy-alfajores-b52bf1.netlify.app'
  // (Remove '*' from here. We'll explicitly echo back only these two.)
];

module.exports.handler = async (event, context) => {
  // 1) CORS preflight (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    // Grab the Origin header from the request
    const requestOrigin = event.headers.origin || '';

    // If the incoming origin is one we trust, echo it back. Otherwise reject.
    let allowOrigin = '';
    if (allowedOrigins.includes(requestOrigin)) {
      allowOrigin = requestOrigin;
    }
    // If allowOrigin is still empty, the request Origin is not on our whitelist.
    // You can either return a 403 here or simply respond with no CORS headers (browser will block).
    if (!allowOrigin) {
      return {
        statusCode: 403,
        body: 'Origin Forbidden',
        headers: {
          'Content-Type': 'text/plain'
        }
      };
    }

    // Return 204 with the proper CORS response headers
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      },
      body: ''
    };
  }

  // 2) For all other methods (GET, POST, etc.), we invoke our Express app via serverless-http
  try {
    // Call the Express app
    const handler = serverless(app);
    const response = await handler(event, context);

    // Now figure out which origin to echo back:
    const requestOrigin = event.headers.origin || '';
    let allowOrigin = '';
    if (allowedOrigins.includes(requestOrigin)) {
      allowOrigin = requestOrigin;
    }
    // If the request origin was not in our whitelist, allowOrigin stays ''. 
    // The browser will block the response (CORS failed).
    if (!allowOrigin) {
      // In production, you might simply want to return 401 or 403 here.
      return {
        statusCode: 403,
        body: 'Origin Forbidden',
        headers: {
          'Content-Type': 'text/plain'
        }
      };
    }

    // Merge our CORS headers into the response from serverless(app)
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Vary': 'Origin'
    };

    return {
      // keep all of serverless-http’s statusCode/body/headers
      statusCode: response.statusCode,
      body: response.body,
      headers: {
        ...(response.headers || {}),
        ...corsHeaders
      }
    };
  } catch (error) {
    console.error('Handler error:', error);
    const requestOrigin = event.headers.origin || '';
    let allowOrigin = '';
    if (allowedOrigins.includes(requestOrigin)) {
      allowOrigin = requestOrigin;
    }
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message || 'Internal Server Error'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Vary': 'Origin'
      }
    };
  }
};
