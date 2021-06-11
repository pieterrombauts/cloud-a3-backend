import 'source-map-support/register'

import {
  formatJSONError,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'

import { DynamoDB, SES } from 'aws-sdk'
import { isResetTokenValid } from '@libs/authHelpers'
import { urlBase64DecodeObj } from '@libs/base64'
import * as argon2 from 'argon2'

const dynamoDb = new DynamoDB.DocumentClient()
const ses = new SES({ region: 'ap-southeast-2' })

const resetPassword: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  try {
    const data = urlBase64DecodeObj(event.body.token)

    if (!isResetTokenValid(data.userId, data.token)) {
      return formatJSONError(new Error('Invalid token'))
    }

    await dynamoDb
      .update({
        Key: { id: data.userId },
        TableName: process.env.USERS_TABLE,
        UpdateExpression: 'set password = :newPassword',
        ExpressionAttributeValues: {
          ':newPassword': await argon2.hash(event.body.newPassword),
        },
      })
      .promise()

    return formatJSONResponse({
      success: true,
      message: 'Password reset',
    })
  } catch (error) {
    console.error(error)
    formatJSONError(new Error('Something went wrong. Please try again!'))
  }
}

export const main = middyfy(resetPassword)
