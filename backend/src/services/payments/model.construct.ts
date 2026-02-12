import { Construct } from "constructs";
import { CreateTransactionSchema } from "./lambdas/create-transaction.schema";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ZodTypeAny } from "zod/v3";
import {
  RestApi,
  Model,
  RequestValidator,
  JsonSchema,
  IRestApi,
} from "aws-cdk-lib/aws-apigateway";

type ApiModelProps = {
  zodSchema: ZodTypeAny;
  apiGw: IRestApi;
};

export class ApiModel extends Construct {
  public validator: RequestValidator;
  public model: Model;

  constructor(scope: Construct, id: string, props: ApiModelProps) {
    super(scope, id);

    const { $schema, ...jsonSchema } = zodToJsonSchema(props.zodSchema, {
      target: "openApi3",
    }) as Record<string, unknown>;

    this.model = new Model(this, `${this.node.id}Model`, {
      restApi: props.apiGw,
      contentType: "application/json",
      schema: jsonSchema as JsonSchema,
    });

    this.validator = new RequestValidator(this, "RequestValidator", {
      restApi: props.apiGw,
      validateRequestBody: true,
    });
  }
}
