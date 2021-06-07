import 'source-map-support/register'

import {
  formatJSONError,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'

import { DynamoDB } from 'aws-sdk'
import { getUserByEmail } from '@libs/authHelpers'

const dynamoDb = new DynamoDB.DocumentClient()

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  try {
    const user = await getUserByEmail(event.body.email)

    if (!user) {
      return formatJSONError(new Error('This email is not registered'))
    }

    if (await argon2.verify(user.password, event.body.password)) {
      return formatJSONResponse({
        token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
      })
    } else {
      return formatJSONError(new Error('Invalid username or password'))
    }
  } catch (error) {
    console.error(error)
    formatJSONError(new Error('Something went wrong. Please try again!'))
  }
}

export const main = middyfy(register)
