import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as xray from 'aws-cdk-lib/aws-xray';
import * as path from 'path';
import { tests } from './lambdas/tests';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

const runtimes = ['bun', 'node'] as const;
const testNames = tests.map((test) => test.name);
const memorySizes = [1024] as const;

export class BunNodeTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaBunLayer = new lambda.LayerVersion(this, 'BunLayer', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      code: lambda.Code.fromAsset(
        path.join(__dirname, 'layers/bun-lambda-layer.zip'),
      ),
      compatibleArchitectures: [lambda.Architecture.X86_64],
      compatibleRuntimes: [lambda.Runtime.PROVIDED_AL2],
    });

    const api = new apigateway.RestApi(this, 'BunNodeTestApi', {
      restApiName: 'Bun Node Test Api',
      description: 'Tests Bun vs Node performance on Lambda',
    });

    for (const runtime of runtimes) {
      const resource = api.root.addResource(runtime);

      for (const testName of testNames) {
        const testResource = resource.addResource(testName);

        for (const memorySize of memorySizes) {
          const testMemoryResource = testResource.addResource(
            String(memorySize),
          );

          const bunFunction = new lambda.Function(
            this,
            `${runtime}-${testName}-${memorySize}-function`,
            {
              runtime:
                runtime === 'bun'
                  ? lambda.Runtime.PROVIDED_AL2
                  : lambda.Runtime.NODEJS_18_X,
              handler: 'handler.handler',
              code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas')),
              architecture: lambda.Architecture.X86_64,
              layers: runtime === 'bun' ? [lambdaBunLayer] : [],
              timeout: cdk.Duration.seconds(30),
              memorySize: memorySize,
              environment: {
                RUNTIME: runtime,
                TEST: testName,
              },
            },
          );

          testMemoryResource.addMethod(
            'GET',
            new apigateway.LambdaIntegration(bunFunction),
          );
        }
      }
    }
  }
}

const app = new cdk.App();
new BunNodeTestStack(app, 'BunNodeTestStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
