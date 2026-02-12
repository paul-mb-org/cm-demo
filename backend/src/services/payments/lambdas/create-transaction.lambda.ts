import type { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { type CreateTransactionInput } from "./create-transaction.schema";

const logger = new Logger({
  serviceName: "CreateTransactionLambda",
});

const createTransactionHandler = async (
  input: CreateTransactionInput,
  event: APIGatewayProxyEvent,
) => {
  logger.info("Received request to create transaction", { input, event });
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msg: "Transaction created successfully" }),
  };
};

export const handler = async (event: APIGatewayProxyEvent) => {
  const body = event.body ? JSON.parse(event.body) : {};

  return await createTransactionHandler(body, event);
};
