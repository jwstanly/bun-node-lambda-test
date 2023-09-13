import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { runtimes, testNames, memorySizes } from './config';

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
new BunNodeTestStack(app, 'BunNodeTestStack');
