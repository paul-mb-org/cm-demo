import { Fn, Stack, StackProps } from "aws-cdk-lib";
import { ApiDefinition, SpecRestApi } from "aws-cdk-lib/aws-apigateway";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
  SourceMapMode,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

export class OrdersApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const depsLockFilePath = path.join(__dirname, "lambdas/package-lock.json");
    const lambdaEntry = (fileName: string) =>
      path.join(__dirname, "lambdas", fileName);

    const sharedLambdaProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_22_X,
      depsLockFilePath,
      bundling: {
        sourceMapMode: SourceMapMode.EXTERNAL,
        externalModules: ["aws-sdk"],
      },
    };

    // Lambda functions
    const createOrderLambda = new NodejsFunction(this, "CreateOrderLambda", {
      entry: lambdaEntry("create-order.lambda.ts"),
      ...sharedLambdaProps,
    });

    const getOrderLambda = new NodejsFunction(this, "GetOrderLambda", {
      entry: lambdaEntry("get-order.lambda.ts"),
      ...sharedLambdaProps,
    });

    // Read and parse OpenAPI spec
    const specPath = path.join(__dirname, "openapi.yaml");
    const spec = yaml.load(fs.readFileSync(specPath, "utf8")) as Record<
      string,
      unknown
    >;

    // Inject Lambda ARNs into integration URIs using Fn.sub
    const integrationUri = (fnArn: string) =>
      Fn.sub(
        `arn:aws:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/\${FnArn}/invocations`,
        { FnArn: fnArn },
      );

    const paths = spec["paths"] as Record<string, Record<string, unknown>>;
    (
      paths["/orders"]["post"] as Record<string, unknown>
    )["x-amazon-apigateway-integration"] = {
      type: "aws_proxy",
      httpMethod: "POST",
      uri: integrationUri(createOrderLambda.functionArn),
      passthroughBehavior: "when_no_match",
    };
    (
      paths["/orders/{id}"]["get"] as Record<string, unknown>
    )["x-amazon-apigateway-integration"] = {
      type: "aws_proxy",
      httpMethod: "POST",
      uri: integrationUri(getOrderLambda.functionArn),
      passthroughBehavior: "when_no_match",
    };

    // Create SpecRestApi from the modified OpenAPI spec
    new SpecRestApi(this, "OrdersApi", {
      apiDefinition: ApiDefinition.fromInline(spec),
    });

    // SpecRestApi does NOT auto-grant invoke permissions — add them manually
    createOrderLambda.addPermission("ApiGwInvoke", {
      principal: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    getOrderLambda.addPermission("ApiGwInvoke", {
      principal: new ServicePrincipal("apigateway.amazonaws.com"),
    });
  }
}
