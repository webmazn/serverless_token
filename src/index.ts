import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const health = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        event: event
      },
      null,
      2
    ),
  };
};