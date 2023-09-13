const { getTestResult } = require('./test.js');

export default {
  async fetch(request) {
    return new Response(getTestResult(), {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
};
