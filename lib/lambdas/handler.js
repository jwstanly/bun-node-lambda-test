const { getTestResult } = require('./test.js');
const RUNTIME = process.env.RUNTIME;

exports.handler = async function (event) {
  const headers = {
    "Content-Type": "text/plain",
  }
  const body = getTestResult();

  return RUNTIME === "Bun"
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

// exports.bun_handler = async function (event) {
//   return new Response(getTestResult(), {
//       status: 200,
//       headers: {
//         "Content-Type": "text/plain",
//       },
//     });
// };

// exports.handler = async function (event) {
//   const response =  {
//     status: 200,
//     headers: {
//       "Content-Type": "text/plain",
//     },
//   };

//   return RUNTIME === 'bun' 
//     ? new Response(getTestResult(), response) 
//     : {...response, body: getTestResult()};
// };