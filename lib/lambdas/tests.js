exports.tests = [
  {
    name: 'sort-once',
    test: () => {
      const arr = [];
      for (let j = 0; j < 1e5; j++) {
        arr.push(Math.random());
      }
      arr.sort();
    },
  },
  {
    name: 'sort-many',
    test: () => {
      const arr = [];
      for (let j = 0; j < 5e3; j++) {
        arr.push(Math.random());
        arr.sort();
      }
    },
  },
  {
    name: 'fetch-api',
    test: async () => {
      const https = require('https');

      async function fetchData(url) {
        return new Promise((resolve, reject) => {
          const options = {
            hostname: 'jsonplaceholder.typicode.com',
            path: url,
            method: 'GET',
          };

          const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
              data += chunk;
            });

            res.on('end', () => {
              try {
                resolve(data);
              } catch (error) {
                reject(error);
              }
            });
          });

          req.on('error', (error) => {
            reject(error);
          });

          req.end();
        });
      }

      const firstResponse = await fetchData('/todos/1');
      console.log('First API Response:', firstResponse);

      const secondResponse = await fetchData('/todos/2');
      console.log('Second API Response:', secondResponse);
    },
  },
  {
    name: 'crypto',
    test: () => {
      const crypto = require('crypto');

      for (let i = 0; i < 5e5; i++) {
        const hash = crypto.createHash('sha256');
        hash.update('Hello, World!');
        const hex = hash.digest('hex');
      }
    },
  },
  {
    name: 'json',
    test: () => {
      const obj = {
        a: 1,
        b: '2',
        c: true,
        d: null,
        e: [1, 2, 3],
        f: {
          a: 1,
          b: 2,
        },
      };

      for (let i = 0; i < 1e6; i++) {
        JSON.stringify(obj);
      }
    },
  },
  {
    name: 'url',
    test: () => {
      const url = require('url');

      for (let i = 0; i < 1e5; i++) {
        const parsed = url.parse('https://example.com/foo/bar?baz=1#qux');
      }
    },
  },
  {
    name: 'querystring',
    test: () => {
      const querystring = require('querystring');

      for (let i = 0; i < 1e6; i++) {
        const parsed = querystring.parse('foo=bar&baz=qux');
      }
    },
  },
  {
    name: 'uuid',
    test: () => {
      const { v1 } = require('uuid');

      for (let i = 0; i < 1e5; i++) {
        const uuid = v1();
      }
    },
  },
  {
    name: 'error-handling',
    test: () => {
      for (let i = 0; i < 1e5; i++) {
        try {
          throw new Error('Hello, World!');
        } catch (error) {}
      }
    },
  },
];
