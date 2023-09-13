import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as xray from 'aws-cdk-lib/aws-xray';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

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

    const bunFunction = new lambda.Function(this, 'BunTestFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas')),
      architecture: lambda.Architecture.X86_64,
      layers: [lambdaBunLayer],
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        RUNTIME: 'Bun',
        TEST: 'sort-once',
      },
    });

    const nodeFunction = new lambda.Function(this, 'NodeTestFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas')),
      architecture: lambda.Architecture.X86_64,
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        RUNTIME: 'Node',
        TEST: 'sort-once',
      },
    });

    const api = new apigateway.RestApi(this, 'BunNodeTestApi', {
      restApiName: 'Bun Node Test Api',
      description: 'Tests Bun vs Node performance on Lambda',
    });

    const bunResource = api.root.addResource('bun');
    bunResource.addMethod('GET', new apigateway.LambdaIntegration(bunFunction));

    const nodeResource = api.root.addResource('node');
    nodeResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(nodeFunction),
    );
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
