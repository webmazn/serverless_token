import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import validator from '@middy/validator'
import {idTokenMiddleware} from './middleware/idTokenMiddleware'
import date from 'date-and-time';

const addToken = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    
    const { email , card_number, cvv, expiration_year, expiration_month} = event.body
    //let email = event.body?.email | null
    const id = uuidv4()

    const client = new DynamoDBClient({});
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const now = new Date();
    const format = 'YYYY/MM/DD HH:mm:ss'
    const createdAt = date.format(now, format)
    const expirationAt = date.format(date.addMinutes(now, 15), format)
   

    const newToken = {
        id,
        email,
        card_number,
        cvv,
        expiration_year,
        expiration_month,
        createdAt,
        expirationAt
    }

    try {
        await ddbDocClient.send(
            new PutCommand({
                TableName : "TokensTable",
                Item: newToken
            })
        );
    } catch (error) {
        console.log(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "new token register",
                token: id
            }
        ),
    };
};

const eventSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                card_number: { type: 'string', minLength: 12, maxLength: 19, pattern: '\\d+' },
                expiration_month: { type: 'integer', minimum: 1, maximum: 12 },
                expiration_year: { type: 'integer', minimum: 2022, maximum: 2027 }, //Mas cinco años
                cvv: { type: 'string', minLength: 3, maxLength: 4, pattern: '\\d+' },
                email: { type: 'string' },
            },
            required: ['card_number']
        }
    }
}

module.exports = {
    addToken: middy(addToken)
        .use(idTokenMiddleware())
        .use(jsonBodyParser())
        .use(validator({ eventSchema }))
        .use(httpErrorHandler())
};

