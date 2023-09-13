import { tests } from './lambdas/tests';

export const testNames = tests.map((test) => test.name);
export const runtimes = ['bun', 'node'] as const;
export const memorySizes = [128, 512, 1024] as const;

export const trialRuns = 5;
export const apiBaseUrl = 'YOUR_URL_HERE';
