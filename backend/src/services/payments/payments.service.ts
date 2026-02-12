import { IRestApi } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import path from "path";
import { CreateTransactionSchema } from "./lambdas/create-transaction.schema";
import { LambdaInt } from "./lambda.construct";
import { ApiModel } from "./model.construct";

type PaymentsServiceProps = {
  apiGw: IRestApi;
};

export class PaymentsService extends Construct {
  constructor(scope: Construct, id: string, props: PaymentsServiceProps) {
    super(scope, id);

    const { apiGw } = props;

    const depsLockFilePath = path.join(__dirname, "lambdas/package-lock.json");
    const lambdaEntry = (fileName: string) =>
      path.join(__dirname, "lambdas", fileName);

    // Resources
    const transactionsPath = apiGw.root.addResource("transactions");
    const transactionsIdPath = transactionsPath.addResource("{id}");

    // Create Transaction
    const createTransactionLambda = new LambdaInt(this, "CreateTransaction", {
      entry: lambdaEntry("create-transaction.lambda.ts"),
      depsLockFilePath,
    });
    const createTransactionModel = new ApiModel(
      this,
      "CreateTransactionModel",
      {
        zodSchema: CreateTransactionSchema,
        apiGw,
      },
    );
    transactionsPath.addMethod(
      HttpMethod.POST,
      createTransactionLambda.integration,
      {
        apiKeyRequired: true,
        requestValidator: createTransactionModel.validator,
        requestModels: { "application/json": createTransactionModel.model },
      },
    );

    // Get Transaction
    const getTransactionLambda = new LambdaInt(this, "GetTransaction", {
      entry: lambdaEntry("get-transaction.lambda.ts"),
      depsLockFilePath,
    });

    transactionsIdPath.addMethod(
      HttpMethod.GET,
      getTransactionLambda.integration,
      {
        apiKeyRequired: true,
      },
    );
  }
}
