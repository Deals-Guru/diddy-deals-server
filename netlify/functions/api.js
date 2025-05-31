const serverless = require('serverless-http');
const app = require('../../index');

exports.handler = serverless(app, {
  binary: ['image/*', 'application/*'],
  response: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
    onError: (err, event, context) => {
      return {
        statusCode: err.statusCode || 500,
        body: JSON.stringify({ error: err.message }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
      };
    }
  }
});