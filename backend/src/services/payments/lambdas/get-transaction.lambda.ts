import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const transactionId = event.pathParameters?.id;

  if (!transactionId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg: "Missing transaction id" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: transactionId,
      amount: 100,
      currency: "USD",
      status: "completed",
      createdAt: "2026-02-11T12:00:00Z",
    }),
  };
};
