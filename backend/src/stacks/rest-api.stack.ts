import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { RestApi, UsagePlan } from "aws-cdk-lib/aws-apigateway";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { PaymentsService } from "../services/payments/payments.service";

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const NAME = "RestApi";

    const apiGw = new RestApi(this, NAME);
    const apiKey = apiGw.addApiKey(`${NAME}ApiKey`);
    const usagePlan = new UsagePlan(this, `${NAME}NoLimitUsage`, {
      apiStages: [
        {
          api: apiGw,
          stage: apiGw.deploymentStage,
        },
      ],
    });
    usagePlan.addApiKey(apiKey);

    new PaymentsService(this, "PaymentsService", {
      apiGw,
    });
  }
}
