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
    const timestamp = new Date().getTime()

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: cuid(),
        firstName: event.body.firstName,
        lastName: event.body.lastName,
        email: event.body.email,
        password: await argon2.hash(event.body.password),
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    }

    await new Promise((resolve, reject) => {
      dynamoDb.put(params, (error, result) => {
        if (error) reject(error)
        resolve(result)
      })
    })

    return formatJSONResponse(params.Item)
  } catch {
    return formatJSONError(
      new Error('Failed to register user. Please try again!'),
    )
  }
}

export const main = middyfy(register)
