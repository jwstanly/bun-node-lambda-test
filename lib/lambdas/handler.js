const { tests } = require('./tests.js');

const RUNTIME = process.env.RUNTIME;
const TEST = process.env.TEST;

async function runTest(testName) {
  const { test } = tests.find((test) => test.name === testName);

  if (test) {
    const start = Date.now();
    await test();
    const end = Date.now();
    return end - start;
  } else {
    return -1;
  }
}

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'text/plain',
  };
  const body = await runTest(TEST);

  return RUNTIME === 'bun'
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
