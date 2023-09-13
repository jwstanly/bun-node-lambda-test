import { runtimes, testNames, memorySizes } from '../bun-node-test-stack';
import {
  exportAllDataToJson,
  exportTestAveragesToCsv,
  recordResult,
} from './exports';

const NUM_RUNS = 5;
const SERVER = 'https://lrvxob60b9.execute-api.us-east-1.amazonaws.com/prod/';

async function runBenchmarks() {
  const testRoutes: string[] = [];
  const results: Record<string, Record<string, Record<string, number[]>>> = {};

  for (const runtime of runtimes) {
    for (const name of testNames) {
      for (const memorySize of memorySizes) {
        testRoutes.push(`${runtime}/${name}/${memorySize}`);
      }
    }
  }

  const apiCallFuncs = testRoutes.map((route) => async () => {
    const response = await fetch(`${SERVER}${route}`);
    const time = await response.text().then(Number);

    recordResult(results, route, time);
  });

  await Promise.all(
    apiCallFuncs.map(async (apiCall) => {
      for (let i = 0; i < NUM_RUNS; i++) {
        await apiCall();
      }
    }),
  );

  console.log('Results:', JSON.stringify(results, null, 2));

  exportAllDataToJson(results);
  for (const testName in results) {
    exportTestAveragesToCsv(testName, results[testName]);
  }
}

runBenchmarks();
