import { runtimes, testNames, memorySizes } from '../bun-node-test-stack';

const NUM_RUNS = 5;
const SERVER = 'https://lrvxob60b9.execute-api.us-east-1.amazonaws.com/prod/';

const testRoutes: string[] = [];
const results: Record<string, Record<string, Record<string, number[]>>> = {};

function recordResult(route: string, time: number) {
  const [runtime, testName, memorySize] = route.split('/');

  console.log(`Finished ${route} in ${time}ms`);

  if (!results[testName]) {
    results[testName] = {};
  }
  if (!results[testName][memorySize]) {
    results[testName][memorySize] = {};
  }
  if (!results[testName][memorySize][runtime]) {
    results[testName][memorySize][runtime] = [];
  }
  results[testName][memorySize][runtime].push(time);
}

for (const runtime of runtimes) {
  for (const name of testNames) {
    for (const memorySize of memorySizes) {
      testRoutes.push(`${runtime}/${name}/${memorySize}`);
    }
  }
}

const apiCalls = testRoutes.map((route) => async () => {
  const response = await fetch(`${SERVER}${route}`);
  const time = await response.text().then(Number);

  recordResult(route, time);
});

const benchmarks = apiCalls.map(async (apiCall) => {
  for (let i = 0; i < NUM_RUNS; i++) {
    await apiCall();
  }
});

Promise.all(benchmarks).then(() => {
  console.log('Results:', JSON.stringify(results, null, 2));
});
