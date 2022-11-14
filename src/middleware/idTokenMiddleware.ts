import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { HandlerLambda, MiddlewareObject } from "middy";
import createHttpError from "http-errors";

export function idTokenMiddleware(): MiddlewareObject<
    APIGatewayEvent,
    APIGatewayProxyResult
> {
    return {
        before: async (
            handler: HandlerLambda<APIGatewayEvent, APIGatewayProxyResult>
        ): Promise<void> => {
            const id = handler.event.headers["authorization"];
            console.log(id)
            if (id === "Bearer pk_test_LstJoiskhHytsmksjgakKhs") {
                return;
            }        
            throw createHttpError(401, "Unauthorized Request");
        },
    };
}