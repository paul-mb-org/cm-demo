import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const orderId = event.pathParameters?.id;

  if (!orderId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Missing order id" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: orderId,
      productId: "prod-abc-123",
      quantity: 2,
      notes: null,
      status: "pending",
      createdAt: "2026-02-11T12:00:00Z",
    }),
  };
};
