import 'source-map-support/register'

import {
  formatJSONError,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'
import * as cuid from 'cuid'
import * as argon2 from 'argon2'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  try {
    const result = await new Promise<DynamoDB.DocumentClient.QueryOutput>(
      (resolve, reject) => {
        dynamoDb.query(
          {
            TableName: process.env.DYNAMODB_TABLE,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :v_email',
            ExpressionAttributeValues: {
              ':v_email': event.body.email,
            },
          },
          (error, result) => {
            if (error) {
              console.error(error)
              reject(new Error('Something went wrong. Please try again!'))
            }
            resolve(result)
          },
        )
      },
    )

    const user = result.Items?.[0]
    if (!(user && (await argon2.verify(user.password, event.body.password)))) {
      return formatJSONError(new Error('Invalid username or password'))
    }
    return formatJSONResponse({ items: user })
  } catch (error) {
    formatJSONError(error)
  }
}

export const main = middyfy(register)
