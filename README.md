# Bun vs Node Lambda Test

Compare Bun vs Node runtimes on Lambda through custom tests.

To start testing, first deploy the API through the AWS CDK, and then run the benchmark script locally.

#### Deploy API

1. `bun install`
2. `bun run cdk synth` (check everything looks good)
3. `bun run cdk deploy`

#### Run Benchmarks Locally

`bun lib/benchmarks/benchmark.ts`

### Custom tests

Any number of tests can be written in `lib/lambdas/tests.js`. Just include a name and function code, and the test will be available through the API and benchmarking.

Rerun both the API deployment and benchmarks after editing `lib/lambdas/tests.js`.
