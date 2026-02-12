import type { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { randomUUID } from "crypto";
import { type CreateOrderInput } from "./create-order.schema";

const logger = new Logger({
  serviceName: "CreateOrderLambda",
});

const createOrderHandler = async (
  input: CreateOrderInput,
  event: APIGatewayProxyEvent,
) => {
  logger.info("Received request to create order", { input, event });
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: randomUUID(),
      productId: input.productId,
      quantity: input.quantity,
      notes: input.notes ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
  };
};

export const handler = async (event: APIGatewayProxyEvent) => {
  const body = event.body ? JSON.parse(event.body) : {};

  return await createOrderHandler(body, event);
};
