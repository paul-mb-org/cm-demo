import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Request, Response } from "express";

export const toApiGatewayEvent = (req: Request): APIGatewayProxyEvent => {
  return {
    body: req.body ? JSON.stringify(req.body) : null,
    headers: req.headers as Record<string, string>,
    multiValueHeaders: {},
    httpMethod: req.method,
    isBase64Encoded: false,
    path: req.path,
    pathParameters: req.params as Record<string, string> | null,
    queryStringParameters: req.query as Record<string, string> | null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayProxyEvent["requestContext"],
    resource: req.path,
  };
};

export type LambdaHandler = (
  event: APIGatewayProxyEvent,
) => Promise<APIGatewayProxyResult>;

export const lambda = (handler: LambdaHandler) => {
  return async (req: Request, res: Response) => {
    const event = toApiGatewayEvent(req);
    const result = await handler(event);
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, String(value));
      }
    }
    res.status(result.statusCode).send(result.body);
  };
};
