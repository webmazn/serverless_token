import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import validator from '@middy/validator'
import { idTokenMiddleware } from './middleware/idTokenMiddleware'

export const getToken = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    const { id } = event.pathParameters

    const client = new DynamoDBClient({});
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    let result = await ddbDocClient.send(new GetCommand({
        TableName: "TokensTable",
        Key: {id},
        // ExpressionAttributeNames: {

        // }
    }))

    if (!result.Item){
        return {
            statusCode: 200,
            body: JSON.stringify({
                exist: false,
                message: "Token no existe o esta vencido"
            }),
        };
    }

    const card = {
        card_number: result.Item?.card_number,
        email: result.Item?.email,
        expiration_year: result.Item?.expiration_year,
        expiration_month: result.Item?.expiration_month,
    } 

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                exist: true,
                card: card
            }
        ),
    };
};

module.exports = {
    getToken: middy(getToken)
        .use(idTokenMiddleware())
        .use(httpErrorHandler())
};