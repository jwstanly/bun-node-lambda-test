import * as fs from 'fs';
import { runtimes } from '../config';

export function exportTestAveragesToCsv(
  testName: string,
  results: Record<string, Record<string, number[]>>,
) {
  const averages = {};
  for (const memorySize in results) {
    averages[memorySize] = {};
    for (const runtime of Object.keys(results[memorySize])) {
      const values = results[memorySize][runtime];
      const sum = values.reduce((acc, value) => acc + value, 0);
      averages[memorySize][runtime] = sum / values.length;
    }
  }

  const csv = [[testName, ...Object.keys(averages)]];
  for (const runtime of runtimes) {
    const row = [runtime];
    for (const memorySize in averages) {
      row.push(averages[memorySize][runtime]);
    }
    csv.push(row);
  }

  const csvString = csv.map((row) => row.join(',')).join('\n');
  fs.writeFileSync(getPath(`${Date.now()}-${testName}.csv`), csvString);
}

export function exportAllDataToJson(
  results: Record<string, Record<string, Record<string, number[]>>>,
) {
  fs.writeFileSync(
    getPath(`${Date.now()}.json`),
    JSON.stringify(results, null, 2),
  );
}

export function recordResult(
  results: Record<string, Record<string, Record<string, number[]>>>,
  route: string,
  time: number,
) {
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

function getPath(fileName: string) {
  return `results/${fileName}`;
}
