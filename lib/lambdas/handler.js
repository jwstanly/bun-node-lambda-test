const { getTestResult } = require('./test.js');
const RUNTIME = process.env.RUNTIME;

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'text/plain',
  };
  const body = getTestResult();

  return RUNTIME === 'Bun'
    ? new Response(body, {
        status: 200,
        headers,
      })
    : {
        statusCode: 200,
        headers,
        body,
      };
};
