import {
  runtimes,
  testNames,
  memorySizes,
  trialRuns,
  apiBaseUrl,
} from '../config';
import {
  exportTestAveragesToCsv,
  exportToJson,
  recordColdStart,
  recordResult,
} from './exports';

async function runBenchmarks() {
  const testRoutes: string[] = [];
  const results: Record<string, Record<string, Record<string, number[]>>> = {};
  const coldStarts: Record<string, Record<string, number[]>> = {};

  for (const runtime of runtimes) {
    for (const name of testNames) {
      for (const memorySize of memorySizes) {
        testRoutes.push(`${runtime}/${name}/${memorySize}`);
      }
    }
  }

  await Promise.all(
    testRoutes.map(async (route, i) => {
      for (let i = 0; i < trialRuns; i++) {
        const start = Date.now();
        const response = await fetch(`${apiBaseUrl}${route}`);
        const end = Date.now();

        const executionTime = await response.text().then(Number);
        const responseTime = end - start;

        if (i == 0) {
          recordColdStart(coldStarts, route, executionTime, responseTime);
        }

        recordResult(results, route, executionTime);
      }
    }),
  );

  console.log('Results:', JSON.stringify(results, null, 2));
  console.log('Cold Starts:', JSON.stringify(coldStarts, null, 2));

  exportToJson(results, 'results');
  exportToJson(coldStarts, 'cold-starts');
  for (const testName in results) {
    exportTestAveragesToCsv(testName, results[testName]);
  }
}

runBenchmarks();
