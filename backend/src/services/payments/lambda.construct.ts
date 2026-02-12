import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunctionProps,
  SourceMapMode,
  NodejsFunction,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

type LambdaIntProps = {
  entry: string;
  depsLockFilePath: string;
};

export class LambdaInt extends Construct {
  public integration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaIntProps) {
    super(scope, id);

    const lambdaProps: NodejsFunctionProps = {
      environment: {},
      runtime: Runtime.NODEJS_22_X,
      depsLockFilePath: props.depsLockFilePath,
      bundling: {
        sourceMapMode: SourceMapMode.EXTERNAL,
        externalModules: ["aws-sdk"],
      },
    };

    const createTransactionLambda = new NodejsFunction(
      this,
      `${this.node.id}Lambda`,
      {
        entry: props.entry,
        ...lambdaProps,
      },
    );
    this.integration = new LambdaIntegration(createTransactionLambda);
  }
}
